////////////////////////////////////////////////////////////////////////////////////////////////////////////
// People and Places Application
//
// This is the main javascript for the application. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Global vars for the app
var user; // object containing the main user and contact data for the app
var people; // object wrapping the Google People API
var tagsDB; // object wrapping the Firebase DB with the contact tags

//these two globals should be moved to the main js file
var map;
var infowindow;

var gapiScriptLoaded = false; // flag to manage the google api's asynchronous load

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
	this.userReady = false; // indicates whether the object has data loaded and is ready for use
	this.contactsReady = false; // indicates whether the object has data loaded and is ready for use
	this.ready = (this.userReady && this.contactsReady); // indicates whether the object has data loaded and is ready for use

	// Private object variables
	var self = this; // convenience variable for private functions

	// Public methods of the object

}

// pnpContact(resID, name, email, address, tags)
// This is the constructor for the user contact object used internally by the app. Any
// of the available properties may be empty except for the resID property.
// 		resID - the People API resource ID to uniquely identify the contact to the API
//		name - the name of the contact
//		email - the email of the contact
//		address - address of the contact
//		tags - array of tag, value objects for any tags attached to the contact
// TODO this constructor needs to be moved to the top app level so it can be used by both
// the pnpUser and pnpPeople classes
function pnpContact(resID, name, email, address, tags) {

	// Public properties of the object
	this.resID = resID; // the People API resource ID to uniquely identify the contact to the API
	this.name = name; // the name of the contact
	this.email = email; // the email of the contact
	this.address = address; // address of the contact
	this.tags = tags; // array of tag, value objects for any tags attached to the contact

	// Public methods of the object

	// this.addTag(tag, value)
	// Adds the specified tag and value to the contact represented by this object
	//		tag - the specific tag to add to this contact
	//		value - the value to associate with the tag
	// TODO actually implement this stub
	
	//Note: We may not need this function since the on click event already performs it

	this.addTag = function(tag) {

	}

	// this.remTag(tag)
	// Removes the specified tag and its associated value from the contact represented by this object
	//		tag - the specific tag to remove from this contact
	// TODO actually implement this stub
	this.remTag = function(tag) {

	}

/* Don't think we need this anymore
	// this.editTag(tag, newValue)
	// Updates the specified tag to a new value for the contact represented by this object
	//		tag - the specific tag of this contact to be edited
	//		newValue - the new value to associate with the tag
	// TODO actually implement this stub
	this.editTag = function(tag) {

	


	}
	 ^^^^^^^^^^^^^^^^
*/

}

function pnpTags() {

    var database;
    var refContacts;

    this.addTags = function(contact, owner, tags) {

    	var newTags = [];
    	console.log(tags);
		refContacts.child(getKeyFromId(contact) + "/tags").once('value').then(function(snapshot) {
			if (snapshot.val() != null) {
    			console.log("snapshot not null");
				newTags = snapshot.val();
    			console.log(newTags);
			};

			for (var i = 0; i < tags.length; i++) {
				newTags.push(tags[i]);
			}
    		console.log(newTags);

			refContacts.child(getKeyFromId(contact)).set({
				owner: owner,
				tags: tags
			});

		});
    	
    }

    this.remTag = function(contact, owner, tag) {

    	var curTags = [];
    	var newTags = [];

		refContacts.child(getKeyFromId(contact) + "/tags").once('value').then(function(snapshot) {

			if (snapshot.val() != null) {
				curTags = snapshot.val();
			};

			if (curTags.length > 0) {
				ndx = curTags.indexOf(tag);
				if (ndx >= 0) {
					for (var i = 0; i < curTags.length; i++) {
						if (i != ndx) {
							newTags.push(curTags(i));
						}
					}
				}
			}

			if (newTags.length > 0) {
				refContacts.child(getKeyFromId(contact)).set({
					owner: owner,
					tags: tags
				});
			}

		});

    }

    this.loadContactTags = function(arrayContacts, owner) {

		refContacts.orderByChild("owner").equalTo(owner).once('value').then(function(snapshot) {
			snapshot.forEach(function(child) {
				var i = 0;
				do {
					var id = getIdFromKey(child.key);
					if (arrayContacts[i].resID == id) {
						arrayContacts[i].tags = child.val().tags;
						break;
					} else i++;
				} while (i < arrayContacts.length);
			});
		});

    }

    function getKeyFromId(id) {
    	return id.replace(/\//ig, "\\");
    }

    function getIdFromKey(key) {
    	return key.replace(/\\/ig, "\/");
    }

	function init() {

		// wait until the gapi javascript has finished loading before proceeding
		var cntRetry = 0;
        while (!user.ready) {
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

	    refContacts = database.ref("contacts");

	    self.addTags("c/0987654321", "c/1234567890", ["Italian Restaurant", "Public Golf", "Old Movies"]);
	    self.addTags("c/1212121212", "c/1234567890", ["Mexican Restaurant", "Exclusive Private Golf", "Foreign Movies"]);
	    self.addTags("c/3434343434", "c/1234567890", ["French Restaurant", "Public Golf", "Action Movies"]);
	    self.addTags("c/5656565656", "c/1234567890", ["German Restaurant", "Exclusive Private Golf", "Mystery Movies"]);
	    self.addTags("c/7878787878", "c/1234567890", ["Sushi Restaurant", "Public Golf", "Horror Movies"]);
	    self.addTags("c/9090909090", "c/1234567890", ["Thai Restaurant", "Exclusive Private Golf", "Romance Movies"]);

	    var array = [];
	    array.push(new pnpContact("c/0987654321"));
	    array.push(new pnpContact("c/1212121212"));
	    array.push(new pnpContact("c/3434343434"));
	    array.push(new pnpContact("c/5656565656"));
	    array.push(new pnpContact("c/7878787878"));
	    array.push(new pnpContact("c/9090909090"));

//	    self.loadContactTags(array, user.resID);
	    self.loadContactTags(array, "c/1234567890");

//	    console.log("c/0987654321", + ", " + self.getTags("c/0987654321"));
//	    console.log("c/1212121212", + ", " + self.getTags("c/1212121212"));
//	    console.log("c/3434343434", + ", " + self.getTags("c/3434343434"));
//	    console.log("c/5656565656", + ", " + self.getTags("c/5656565656"));
//	    console.log("c/7878787878", + ", " + self.getTags("c/7878787878"));
//	    console.log("c/9090909090", + ", " + self.getTags("c/9090909090"));
		self.addTags("c/0987654321", "c/1234567890", ["UT Football"]);
//	    console.log("c/0987654321", + ", " + self.getTags("c/0987654321"));
//	    console.log("c/1212121212", + ", " + self.getTags("c/1212121212"));
//	    console.log("c/3434343434", + ", " + self.getTags("c/3434343434"));
//	    console.log("c/5656565656", + ", " + self.getTags("c/5656565656"));
//	    console.log("c/7878787878", + ", " + self.getTags("c/7878787878"));
//	    console.log("c/9090909090", + ", " + self.getTags("c/9090909090"));

	}

	self = this;

	init();

}

	////////////////////////Will's Functions//////////////////////////////////////

	
	//Initial array of labels
	var labelsArray = ['Seafood', 'Mexican food', 'Chinese food', 'Thai food',
	'French food', 'Museums', 'Parks', 'Pools', 'Monuments', 'Clubs', 'Dance Music'];

	//Dummy Data for developing purposes 
	var contactsArray  = [{contactName:"Mike", address:"100 N Brazos Austin, TX", tags: ['Sushi', 'Movies', 'Golf','Concerts','Art Museum']},
                				{contactName:"Steve", address:"312 S Madison St., La Grange IL", tags: ['Concerts', 'Dance', 'Movies','Baseball']},
                				{contactName:"Lisa", address:"1060 W Addison St., Chicago IL", tags:['Bowling', 'Concerts', 'Art Museum', 'Golf','Sailing']}];











	function editContact() {


	//alert(this.value);

	var contact = contactsArray[this.value];
	var name = contact.name;
	$('#contactName').value(contact.contactName);
	$('#editedContact').show();

	console.log(contact.contactName);

	
	}
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
	
	//Loops through array of labels
	for (var i = 0; i < labelsArray.length; i++){

		
		var l = $('<button type="button" class="btn btn primary btm-sm">')

		l.addClass('label'); //Added class
		l.attr('data-name', labelsArray[i]); //added data-attribute
		l.text(labelsArray[i]); //Displays label text on button
		
		
		//Logic to sort the labels into designated Panels
		
		if(labelsArray[i].includes("food") === true || labelsArray[i].includes("food") === true){
			
			//console.log("it's a restaurant");
			
			$('#restaurantDisplay').append(l); /*Adds buttons to HTML*/

		}else if(labelsArray[i].includes("club") || labelsArray[i].includes("Club") === true || labelsArray[i].includes("live") === true || labelsArray[i].includes("Music") === true) {

			//console.log("it's a nightlife activity");
			
			$('#nightDisplay').append(l); /*Adds buttons to HTML*/ 

		}else if(labelsArray[i].includes("outdoors") || labelsArray[i].includes("mountains")||labelsArray[i].includes("hiking")|| labelsArray[i].includes("rivers")
		||labelsArray[i].includes("Pools")||labelsArray[i].includes("Pools")||labelsArray[i].includes("Parks")){
			
			//console.log("it's an Activity");
			
			$('#activitiesDisplay').append(l); /*Adds buttons to HTML*/
		
		}else{

			$('#labelsDisplay').append(l); /*Adds buttons to HTML*/

		}

	}
 
 }


///////////////////////////////////////////////////////////////////////////////


	function renderContacts() {

	$('#contactsDisplay').empty();	


	for(var i=0; i < contactsArray.length; i++){
		var edit = $('<button type="submit" class="editButton" value="' + i + '">Edit</button>');
		var contact = contactsArray[i];
		var c = $('<div class="contactDiv">');
		c.text(contact.contactName + " " + contact.address + " " + contact.tags.toString()); //Displays label text on button
		
		c.attr('data-name', i);    
		c.append(edit);
		c.append('</div>');

		console.log(c);
		$('#contactsDisplay').append(c);



	};












}

