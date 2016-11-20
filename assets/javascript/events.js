// Start the app up when everything is loaded
$(document).ready(function(){

	// Create the main app object
	user =  new pnpUser();

	// And the service objects
	people = new pnpPeople(); // service object for the Google People API

})

// handleGapiScriptLoad()
// Callback handler for when the Google API javascript library has completed loading
function handleGapiScriptLoad() {

	gapiScriptLoaded = true;

}
