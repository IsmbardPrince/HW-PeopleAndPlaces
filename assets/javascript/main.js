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
	this.tags = tags; // array of tag, value objects for any tags attached to the contact

	// Public methods of the object

	// this.addTag(tag, value)
	// Adds the specified tag and value to the contact represented by this object
	//		tag - the specific tag to add to this contact
	//		value - the value to associate with the tag
	// TODO actually implement this stub
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

function pnpTags() {

    var database;

    this.addContact(contact, owner, tags) {

    }

    this.addTags(contact, owner, tags) {
    	
    }

	function init() {

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

	}

	init();

}
