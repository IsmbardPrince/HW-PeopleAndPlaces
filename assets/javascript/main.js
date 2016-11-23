////////////////////////////////////////////////////////////////////////////////////////////////////////////
// People and Places Application
//
// This is the main javascript for the application. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Global vars for the app
var user; // object containing the main user and contact data for the app
var people; // object wrapping the Google People API

//these two globals should be moved to the main js file
var map;
var infowindow;

//global to hold the contact list in local storage
var contactList = [];
//global to determine if a contact has been selected
var contactSelected = false;
//global to hold the current contact, if one has been selected
var currentContact;

var gapiScriptLoaded = false; // flag to manage the google api's asynchronous load

// pnpUser(userName)
// This is the constructor for the main user object of the app. It surfaces the user and contact data
// displayed by the UI and provides the methods for creating, modifying and deleting app data as indicated
// by the app user. It utilizes service objects to access the api's and database which provide the backend 
// functionality used by the app.
//		userName - the google user name to initialize the app for; if not specified, last user is used
function pnpUser(userName) {

	// Public properties of the object
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
	this.tags = []; // array of tag, value objects for any tags attached to the contact

	// Public methods of the object

	// this.addTag(tag, value)
	// Adds the specified tag and value to the contact represented by this object
	//		tag - the specific tag to add to this contact
	//		value - the value to associate with the tag
	// TODO actually implement this stub
	
	//Note: We may not need this function since the on click event already performs it

	this.addTag = function(tag, value) {

	}

	// this.remTag(tag)
	// Removes the specified tag and its associated value from the contact represented by this object
	//		tag - the specific tag to remove from this contact
	// TODO actually implement this stub
	this.remTag = function(tag) {

	}

	// this.editTag(tag, newValue)
	// Updates the specified tag to a new value for the contact represented by this object
	//		tag - the specific tag of this contact to be edited
	//		newValue - the new value to associate with the tag
	// TODO actually implement this stub
	this.editTag = function(tag, newValue) {

	


	}
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
	
	//Loops through array of labels
	for (var i = 0; i < labelsArray.length; i++){

		
		var l = $('<button type="button" class="btn btn primary btm-sm">')

		l.addClass('label'); //Added class
		l.attr('data-name', labelsArray[i]); //added data-attribute
		l.text(labelsArray[i]); //Displays label text on button
		
		
		//Logic to sort the labels into designated Panels
		
		if(labelsArray[i].includes("food") === true || labelsArray[i].includes("Food") === true || labelsArray[i].includes("restaurant") === true){
			
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

	//rendering the contacts in the contacts div
	function renderContacts(contactsArray) {

	$('#contactsDisplay').empty();	

	$('#contactsDisplay').append("<p>Select a contact to add or remove tags:</p>")


	for(var i=0; i < contactsArray.length; i++){
		var contact = contactsArray[i];
		var c = $('<div class="contactDiv" id="contact-'+i+ '">');
		

		//check whether there are tags on the contact already, if so, render them
		if (contactsArray.tags){
			c.text(contact.name + " " + contact.address + " "+ contact.tags.toString());
		}
		else{
			c.text(contact.name + " " + contact.address + " ");
		}
		
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
			$("#activities").append("<h4>"+contactList[i].name+"</h4>");
			for (var j = 0; j < contactList[i].tags.length; j++){
			$("#activities").append("<button class='activity' id='"+contactList[i].name+"|"+contactList[i].tags[j]+"'>"+contactList[i].tags[j]+" with "+contactList[i].name+"</button>");
			}
			$("#activities").append("<br>");
		}
	}

}

