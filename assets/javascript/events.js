// Start the app up when everything is loaded
$(document).ready(function(){

	// Create the main app object
	user =  new pnpUser();

	// And the service objects
	people = new pnpPeople(); // service object for the Google People API

	// And finally this is where the function call to load the DOM with the data will go

})

// handleGapiScriptLoad()
// Callback handler for when the Google API javascript library has completed loading
function handleGapiScriptLoad() {

	gapiScriptLoaded = true;



/////////////////////ON CLICK EVENTS///////////////////////////////////////////////////

//This function adds user inputed labels to the labelArray

$("#addLabelButton").on("click", function(){

	//Captures the user input value and puts into a variable
	var label = $('#labelBox').val().trim();

	//Pushes the variable into an array
	labelsArray.push(label);

	//Console logs the array for development purposes
	console.log(labelsArray);
	
	//Calls the render labels function
	renderLabels();
	
	//Prevents the form from discarding the console.log 
	event.preventDefault();

});

//This on click event calls the editContact function

$(".editButton").on("click", editContact);

//This on click event calls the deleteLabelButton function


$("#deleteLabelButton").on("click", deleteLabel);


//This on click event resets all of the label displays 

$('#resetLabelsButton').on('click', function(){



	$('#labelsDisplay').empty();	
	$('#restaurantDisplay').empty();
	$('#activitiesDisplay').empty();
	$('#nightDisplay').empty();


});





///////////////////////////////////////////////////////////







}

