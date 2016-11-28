////////////////////////////////////////////////////////////////////////////////////////////////////////////
// People and Places Application
//
// This is the main javascript for the application. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Global vars for the app
var user; // object containing the main user and contact data for the app
var people; // object wrapping the Google People API
var tagsDB; // object wrapping the Firebase DB with the contact tags

//these two globals are for the geolocation functions
var map;
var infowindow;

//global to hold the contact list in local storage
var contactList = [];
//global to determine if a contact has been selected
var contactSelected = false;
//global to hold the current contact, if one has been selected
var currentContact;

//var gapiScriptLoaded = false; // flag to manage the google api's asynchronous load

// pnpUser(userName)
// This is the constructor for the main user object of the app. It surfaces the user and contact data
// displayed by the UI and provides the methods for creating, modifying and deleting app data as indicated
// by the app user. It utilizes service objects to access the api's and database which provide the backend 
// functionality used by the app.
//		userName - the google user name to initialize the app for; if not specified, last user is used
function pnpUser(userName) {

	// Public properties of the object
	this.resID = ""; // the People API resource ID that uniquely identifies this user
	this.name = ""; // the full name of the signed-in google account currently accessing the app
	this.email = ""; // the email address of the signed-in google account currently accessing the app
	this.address = ""; // the street address of the signed-in google account currently accessing the app
	this.contacts = []; // array of the user's contact objects
	this.userTags = []; // array of tag types which are defined for the current user
	this.userReady = false; // indicates whether the user's profile data has been loaded and is ready for use
	this.contactsReady = false; // indicates whether the user's contact data has been loaded and is ready for use
	this.ready = (this.userReady && this.contactsReady); // indicates whether the object has data loaded and is ready for use

	// Private object variables
	var self = this; // convenience variable for private functions

	// Public methods of the object

    // pnpUser.saveTags(newTagArray)
    // This method writes the supplied tags array to the contact record for the specified
    // Contact and owner. The newly written tags will completely erase any tags for that
    // contact and owner which previously existed.
    this.saveTags = function(newTagArray) {

		// Set this owner's IDsto write the tag list to the appropriate user record
		tagsDB.saveTags(self.resID, newTagArray);
    	
    }

}

// pnpContact(resID, name, email, address, tags)
// This is the constructor for the user contact object used internally by the app. Any
// of the available properties may be empty except for the resID property.
// 		resID - the People API resource ID to uniquely identify the contact to the API
//		name - the name of the contact
//		email - the email of the contact
//		address - address of the contact
//		tags - array of tag, value objects for any tags attached to the contact
function pnpContact(resID, name, email, address, tags) {

	// Public properties of the object
	this.resID = resID; // the People API resource ID to uniquely identify the contact to the API
	this.name = name; // the name of the contact
	this.email = email; // the email of the contact
	this.address = address; // address of the contact
	this.tags = []; // array of tags attached to the contact

	var self = this;

	// Public methods of the object

	// pnpContact.addtags(tags)
	// This method writes the provided tag array to the Firebase database for the contact associated
	// with this object instance. All editing of tags is handled by the UI and the tag list for the entire
	// tag list for the contact is replaced by a new list by this method whenever it is changed. This means
	// that no additional database access methods are necessary for tag updates or deletions.
	this.addTags = function(tags) {

		// Set this contact's and owner's IDs to write the tag list to the appropriate contact record
		tagsDB.addTags(self.resID, user.resID, tags);

	}

}

// pnpTags()
// This is the constructor for the Firebase API service object. It handles all the actual API
// interactions to add and retrieve contact tag information from the Firebase database.
// When this object is instantiated, it automatically initializes the API interface and then uses that
// interface to acquire any existing tags for contacts of the signed-in user, pushing that data to
// the app's main user object. At that point the main user object is fully initialized and ready for use
// by the UI. Since the People API service object contains data needed to perform the
// initial tag retrieval, it must have completed initialization before this object can complete its
// initialization.
function pnpTags() {

	// Flag to indicate this service object is ready for use
	this.ready = false;

	// Object globals
    var database; // contains the Firebase access global
    var refContacts; // contains the Firebase reference to the Contact records
    var refUsers; // contains the Firebase reference to the User records

    // pnpTags.addTags(contact, owner, tags)
    // This method writes the supplied tags array to the contact record for the specified
    // Contact and owner. The newly written tags will completely erase any tags for that
    // contact and owner which previously existed.
    this.addTags = function(contact, owner, tags) {

    	// write the tags into the Firebase ID for the specified contact
		refContacts.child(getKeyFromId(contact)).set({
			owner: owner,
			tags: tags
		});
    	
    }

    // pnpTags.saveTags(owner, tags)
    // This method writes the supplied tags array to the user record for the specified
    // owner. The newly written tags will completely erase any tags for that user
    // which previously existed.
    this.saveTags = function(owner, tags) {

    	// write the tags into the Firebase ID for the specified contact
		refUsers.child(getKeyFromId(owner)).set({
			tags: tags
		});
    	
    }

	// loadContactTags()
	// This function loads any existing tags for contacts which are owned by the currently signed-in
	// user. This function requires that the People API service object has completed initialization so
	// that we can access the currently signed in user's resource ID.
    function loadContactTags() {

		// wait until we are sure the owner's id and contact list is available
		var cntRetry = 0;
	    while (!user.userReady || !user.contactsReady) {
	    	// TODO need to handle the case where the object is not ready after 500 seconds
	    	// TODO as that means something is seriously wrong
			if (cntRetry++ < 1000) {
				setTimeout(loadContactTags, 500);
				return;
			} 
		}

		// iterate through all of the contacts in the db that are owned by this user; for each user in the
		// db, load any existing tags into their contact object for the user
		// any contacts without existing tags and any contacts in the db which the user no longer owns
		// are both ignored
		refContacts.orderByChild("owner").equalTo(user.resID).once('value').then(function(snapshot) {
			snapshot.forEach(function(child) {
				var i = 0;
				do {
					var id = getIdFromKey(child.key);
					if (user.contacts[i].resID == id) {
						user.contacts[i].tags = child.val().tags;
						break;
					} else i++;
				} while (i < user.contacts.length);
			});
		});

		refUsers.orderByKey().equalTo(user.resID).once('value').then(function(snapshot) {
			snapshot.forEach(function(child) {
				user.userTags = child.val().tags;
			});
		});

		// finally mark the user object that it is ready for use by the UI
		user.ready = true;

    }

    // getKeyFromId(id)
    // Since resource IDs obtained from the Google People ID can contain "/" characters, which are
    // invalid in a Firebase key field, we must translate the "/" characters into "\" characters.
    // That is what this function does.
    function getKeyFromId(id) {
    	return id.replace(/\//ig, "\\");
    }

    // getIdFromKey(key)
    // Since resource IDs obtained from a contact record in the Firebase db will have had "/" characters
    // mapped to "\" characters, we need to change them back to "/" characters for string comparison
    // purposes. That is what this function does.
    function getIdFromKey(key) {
    	return key.replace(/\\/ig, "\/");
    }

	function init() {

		// make sure that the Google People API service object has completed initialization before we
		// try to initialize this object
		var cntRetry = 0;
        while (!user.userReady || !user.contactsReady) {
        	// TODO something is seriously wrong if the script hasn't loaded in 500 seconds
        	// TODO but we still probably need to write some error handling here JIC
        	// TODO or better yet replace it with a callback
			if (cntRetry++ < 1000) {
				setTimeout(init, 500);
				return;
			} 
        }

		// Initialize Firebase
		var config = {
		apiKey: "AIzaSyCeX4km95QWqdGNVmUyViVokHeGtgKEdJc",
		authDomain: "my-first-project-bd5a1.firebaseapp.com",
		databaseURL: "https://my-first-project-bd5a1.firebaseio.com",
		storageBucket: "my-first-project-bd5a1.appspot.com",
		messagingSenderId: "81635511272"
		};
		firebase.initializeApp(config);

	    // Get a reference to the database service
	    database = firebase.database();
	    // and a reference to the contact records in our database
	    refContacts = database.ref("contacts");
	    // and a reference to the contact records in our database
	    refUsers = database.ref("users");

	    // Make the initial load of tags for this user's contacts
		loadContactTags();

		// Indicate that this service object is open for business
		self.ready = true;

	}

	self = this; // convenience variable

	init(); // Initialize this object on construction

}

// loadInitData()
// This function exists to ensure that all of our initial API calls and DB loads are complete before
// we actually load the DOM. While this will probably not be a problem in most cases, the timer here insures
// that it's not a problem.
function loadInitData() {

	// wait until we are sure all initial API and DB calls have completed
	var cntRetry = 0;
    while (!user.ready) {
    	// TODO need to handle the case where the object is not ready after 500 seconds
    	// TODO as that means something is seriously wrong
		if (cntRetry++ < 1000) {
			setTimeout(loadInitData, 500);
			return;
		} 
	}

	console.log("in loadInitData");

	// Load the DOM
    renderContacts(user.contacts);
    renderLabels();
    contactList = user.contacts;
    listActivities(user.contacts);

}




	////////////////////////frontend functions//////////////////////////////////////

	
	//Initial array of labels
	var labelsArray = ['Seafood', 'Mexican food', 'Chinese food', 'Thai food',
	'French food', 'Museums', 'Parks', 'Pools', 'Monuments', 'Clubs', 'Dance Music'];

	//Dummy Data for developing purposes 
	/*var contactsArray  = [{contactName:"Mike", address:"100 N Brazos Austin, TX", tags: ['Sushi', 'Movies', 'Golf','Concerts','Art Museum']},
                				{contactName:"Steve", address:"312 S Madison St., La Grange IL", tags: ['Concerts', 'Dance', 'Movies','Baseball']},
                				{contactName:"Lisa", address:"1060 W Addison St., Chicago IL", tags:['Bowling', 'Concerts', 'Art Museum', 'Golf','Sailing']}];*/








/*

	function editContact() {


	//alert(this.value);

	var contact = contactsArray[this.value];
	var name = contact.name;
	$('#contactName').value(contact.contactName);
	$('#editedContact').show();

	console.log(contact.contactName)

	
	}



	*/
	////////////////////////////////////////////////////////

	function deleteLabel(){   

	//Captures the user input and deletes it
		
		var label = $('#labelBox').val().trim();
		//Splices the selected label
		if(label !== ""){

			var index = labelsArray.indexOf(label);
			if (index > -1){

				labelsArray.splice(index, 1);
			}
		}


		renderLabels();

		event.preventDefault();
	}

	///////////////////////////////////////////////////////////

	function renderLabels(){

	    $('#labelsDisplay').empty();	
		$('#restaurantDisplay').empty();
		$('#activitiesDisplay').empty();
		$('#nightDisplay').empty();	
	
	console.log(user.userTags);
	//Loops through array of labels
	//Loops through array of labels
	for (var i = 0; i < labelsArray.length; i++){

		
		var l = $('<button type="button" class="btn btn-default">')

		l.addClass('label'); //Added class
		l.attr('data-name', labelsArray[i]); //added data-attribute
		l.text(labelsArray[i]); //Displays label text on button
		
		
		//Logic to sort the labels into designated Panels
		
		if(


			labelsArray[i].includes("food") || labelsArray[i].includes("Food") || labelsArray[i].includes("restaurant") || labelsArray[i].includes("Restaurant") || labelsArray[i].includes("bistro") || 
			labelsArray[i].includes("Bistro") || labelsArray[i].includes("bar") || labelsArray[i].includes("Bar") || labelsArray[i].includes("café")|| labelsArray[i].includes("Café") || labelsArray[i].includes("cafeteria") 
			|| labelsArray[i].includes("Cafeteria") || labelsArray[i].includes("buffet")|| labelsArray[i].includes("Buffet") || labelsArray[i].includes("brasserie") || labelsArray[i].includes("Brasserie") 
			


			){
			
				$('#restaurantDisplay').append(l); /*Adds buttons to HTML*/

		}else if( 
				            

			labelsArray[i].includes("club") || labelsArray[i].includes("Club") || labelsArray[i].includes("live") || labelsArray[i].includes("Live") || labelsArray[i].includes("Festival") || 
				labelsArray[i].includes("festival") || labelsArray[i].includes("Cocktail") || labelsArray[i].includes("pub") || labelsArray[i].includes("Pub") || labelsArray[i].includes("cocktail")
				|| labelsArray[i].includes("downtown") || labelsArray[i].includes("Downtown") || labelsArray[i].includes("nightSpot") || labelsArray[i].includes("NightSpot") || labelsArray[i].includes("Uptown") || labelsArray[i].includes("uptown")


			
			){

			
				$('#nightDisplay').append(l); 

		}else if(

			labelsArray[i].includes("outdoors") || labelsArray[i].includes("Outdoors") || labelsArray[i].includes("Mountain") || labelsArray[i].includes("mountain")||labelsArray[i].includes("Hiking")|| labelsArray[i].includes("hiking") || 
			labelsArray[i].includes("River") || labelsArray[i].includes("river") ||labelsArray[i].includes("pool")||labelsArray[i].includes("Pool")||labelsArray[i].includes("Park") ||labelsArray[i].includes("park") ||labelsArray[i].includes("skiing") ||labelsArray[i].includes("Skiing")
			||labelsArray[i].includes("backpacking") ||labelsArray[i].includes("Backpacking") ||labelsArray[i].includes("Snowboarding") ||labelsArray[i].includes("snowboarding")


			){
			
				
				$('#activitiesDisplay').append(l); 
		
		}else{

				$('#labelsDisplay').append(l); 

		}

	}
 
 }


///////////////////////////////////////////////////////////////////////////////

	//rendering the contacts in the contacts div
	function renderContacts(contactsArray) {

	$('#contactsDisplay').empty();	

	$('#contactsDisplay').append("<p><strong>Select a contact to add or remove tags:</strong></p>")


	for(var i=0; i < contactsArray.length; i++){
		var contact = contactsArray[i];
		var c = $('<div class="contactDiv" id="contact-'+i+ '">');
		

		//check whether there are tags on the contact already, if so, render them

			c.text(contact.name);
		
		c.attr('data-name', i);    
		c.append('</div>');

		console.log(c);
		$('#contactsDisplay').append(c);


	};

}


//function to highlight current tag buttons. need to be able to handle removal from here too.

function highlightTags(){
	$(".tagSelected").removeClass("tagSelected");
	for (var i = 0; i < labelsArray.length; i++){
		if (currentContact.tags.includes(labelsArray[i])){
			$(":contains('"+labelsArray[i]+"')").closest('button.label').addClass("tagSelected");
		}
	}
}


function listActivities(){
	$("#activities").empty();
	for (var i = 0; i < contactList.length; i++){
		if(contactList[i].tags.length > 0){
			$("#activities").append("<h4>...with "+contactList[i].name+" (near "+contactList[i].address+")</h4>");
			for (var j = 0; j < contactList[i].tags.length; j++){
			$("#activities").append("<a href='#map'><button  class='activity' id='"+contactList[i].name+"|"+contactList[i].tags[j]+"'>"+contactList[i].tags[j]+" with "+contactList[i].name+"</button></a>");
			}
			$("#activities").append("<br>");
		}
	}

}

