////////////////////////////////////////////////////////////////////////////////////////////////////////////
// People and Places Application
//
// This is the main javascript for the application. 
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Global vars for the app
var user; // object containing the main user and contact data for the app
var people; // object wrapping the Google People API

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
	this.ready = false; // indicates whether the object has data loaded and is ready for use

	// Private object variables
	var self = this; // convenience variable for private functions

	// Public methods of the object

	// this.init()
	// This method is called to initialize the object by loading the appropriate user and contact
	// data.  It uses the global service object for the google people api as the source of that
	// data.
	this.init = function () {
		self.name = "Dudley Doright";
		self.email = "dudley_doright@gmail.com";
		self.address = "Somewhere St. Manitoba, Canada 99999"
	}

}
