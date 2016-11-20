// pnpPeople()
// This is the constructor for the Google People API service object. It handles all the actual API
// interactions and surfaces properties and methods for the UI to access and manipulate that information.
// When this object is instantiated, it automatically initializes the API interface and then uses that
// interface to acquire the initial user and contact info for the UI to display.
function pnpPeople() {

	// Public properties of the object
	this.userName = ""; // user name the API interface is set to
	this.userEmail = ""; // email for the current user
	this.userAddress = ""; // address of the current user
	this.userContacts = []; // array of userContact objects for the current user

	this.apiAvailable = false; // indicates whether the api interface is ready to use
	this.apiStatus = -1; // TODO use this to indicate status of last api operation
	this.apiMessage = ""; // TODO use this to contain any msg from last api operation

	// Private object variables
	// Following values are the keys and other data needed to access the Google People API
	// Enter an API key from the Google API Console:
	//   https://console.developers.google.com/apis/credentials
	var apiKey = 'AIzaSyCeX4km95QWqdGNVmUyViVokHeGtgKEdJc';
	// Enter the API Discovery Docs that describes the APIs you want to
	// access. In this example, we are accessing the People API, so we load
	// Discovery Doc found here: https://developers.google.com/people/api/rest/
	var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
	// Enter a client ID for a web application from the Google API Console:
	//   https://console.developers.google.com/apis/credentials?project=_
	// In your API Console project, add a JavaScript origin that corresponds
	//   to the domain where you will be running the script.
	var clientId = '81635511272-3aqree7eknd8g7jdb905gcn9pvesjgg6.apps.googleusercontent.com';
	// Enter one or more authorization scopes. Refer to the documentation for
	// the API or https://developers.google.com/people/v1/how-tos/authorizing
	// for details.
	var scopes = 'https://www.googleapis.com/auth/contacts.readonly';

	// The API object for the current signed-in google user
	var curGoogleUser;

	// Public methods of the object
	// TODO implement any API methods needed beyond accessing the initial data
	// TODO not sure if there will be any at this time

	// Private functions for the object

	// initUserData()
	// Begins the process of initializing the API interface and accessing the initial data
	// after the Google API javascript library has completed loading
	function initUserData() {

		// wait until the gapi javascript has finished loading before proceeding
		var cntRetry = 0;
        while (!gapiScriptLoaded) {
        	// TODO something is seriously wrong if the script hasn't loaded in 500 seconds
        	// TODO but we still probably need to write some error handling here JIC
        	// TODO or better yet replace it with a callback
			if (cntRetry++ < 1000) {
				setTimeout(initUserData, 500);
				return;
			} 
        }

        // Load the API client and auth2 library; callback to initGapiClient when done
        gapi.load('client:auth2', initGapiClient);
	}

	// initGapiClient()
	// Callback from completing the load of the Google API client and authentication modules.
	// Uses the Google API function().then() mechanism for completion callback.
	function initGapiClient() {
		// Init the gapi client with our app info
		gapi.client.init({
			apiKey: apiKey,
			discoveryDocs: discoveryDocs,
			clientId: clientId,
			scope: scopes
		}).then(function () {
			// Get the current user's google sign-in state and listen for changes to it
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
			// Handle the initial sign-in state and make sure the user is signed in
			updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

	    });
	}

	// userContact(resID, name, email, address, tags)
	// This is the constructor for the user contact object used internally by the app. Any
	// of the available properties may be empty except for the resID property.
	// 		resID - the People API resource ID to uniquely identify the contact to the API
	//		name - the name of the contact
	//		email - the email of the contact
	//		address - address of the contact
	//		tags - array of tag, value objects for any tags attached to the contact
	// TODO this constructor needs to be moved to the top app level so it can be used by both
	// the pnpUser and pnpPeople classes
	function userContact(resID, name, email, address, tags) {

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

	// getUserData()
	// After we have established proper authentication credentials with the Google People API,
	// this function accesses the data for the app user and their contact list, making it publically
	// available to other functions of the app.
	// Uses the Google API function().then() mechanism for completion callback.
	function getUserData() {

		// wait until the user has signed-in before proceeding
		var cntRetry = 0;
        while (!self.apiAvailable) {
        	// TODO if the user hasn't signed-in in 500 seconds we need to write some error handling here
        	// TODO or better yet, replace it with a callback
			if (cntRetry++ < 1000) {
				setTimeout(getUserData, 500);
				return;
			} 
		}

		// Get info for our current user
		curGoogleUser = gapi.auth2.getAuthInstance().currentUser.get();
		gapi.client.people.people.get({
			'resourceName': 'people/me',
			'requestMask.includeField': 'person.names,person.emailAddresses,person.addresses'
		}).then(function(resp) {
			var user = resp.result;
			if (user.names && user.names.length > 0) {
				self.userName = user.names[0].displayName;
			} else {
				self.userName = "";
			}
			if (user.emailAddresses && user.emailAddresses.length > 0) {
				self.userEmail = user.emailAddresses[0].value;
			} else {
				self.userEmail = "";
			}
			if (user.addresses && user.addresses.length > 0) {
				self.userAddress = user.addresses[0].formattedValue;
			} else {
				self.userAddress = "";
			}
		})

		// And their contact list
		// TODO number of contacts to retrieve is set to 500 which will work for our test case
		// TODO but need to handle the case where their are more contacts than can be loaded in
		// TODO one call
        gapi.client.people.people.connections.list({
           'resourceName': 'people/me',
           'pageSize': 500,
			'requestMask.includeField': 'person.names,person.emailAddresses,person.addresses'
         }).then(function(resp) {
			var connections = resp.result.connections;

			// load the contact info into the contacts array
			self.userContacts = [];
			if (connections.length > 0) {
				for (i = 0; i < connections.length; i++) {
					var person = connections[i];
					var resID = person.resourceName;
					var name = "";
					if (person.names && person.names.length > 0) {
						name = person.names[0].displayName;
					}
					var email = "";
					if (person.emailAddresses && person.emailAddresses.length > 0) {
						email = person.emailAddresses[0].value;
					}
					var address = "";
					if (person.addresses && person.addresses.length > 0) {
						address = person.addresses[0].formattedValue;
					}
					self.userContacts.push(new userContact(resID, name, email, address));
				}
			}
         });

    }

	// updateSigninStatus(isSignedIn)
	// If we don't have an authenticated API access token for the current user, this function is
	// used to present the app user with the Google app access authorization dialog. When they
	// are signed in and we have authenticated API access, we set a flag indicating that this
	// service object can be used to access the API to retrieve user and contact info.
	// 		isSignedIn - indicates the app user's current Google signed-in status
	function updateSigninStatus(isSignedIn) {
		// Sign in the user if they are not currently signed in
		if (!isSignedIn) {
			gapi.auth2.getAuthInstance().signIn().then(function () {
				// Mark that we are cocked and loaded and can use the api now
				self.apiAvailable = true;
			});
		}
	}

	// init()
	// Object initialization function called when the object is instantiated.
	function init() {
		initUserData(); // load and initialize the Google API so we can use it
		getUserData(); // use the API to retrieve the info for the current user and their contacts
	}

	// convenience variable for easy instance access from private functions
	var self = this;

	// Executed when the constructor is called, i.e. var xxx = new pnpPeople();
	init(); // initialize and load the data for this object instance
	console.log(this);

}
