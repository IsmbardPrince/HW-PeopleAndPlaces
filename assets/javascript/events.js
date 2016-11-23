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

//$(".editButton").on("click", editContact);

//This on click event calls the deleteLabelButton function


$("#deleteLabelButton").on("click", deleteLabel);


//This on click event resets all of the label displays 

$('#resetLabelsButton').on('click', function(){



	$('#labelsDisplay').empty();	
	$('#restaurantDisplay').empty();
	$('#activitiesDisplay').empty();
	$('#nightDisplay').empty();


});



// selecting a contact to edit tags

$(document.body).on("click",".contactDiv",function(){
	$(".contactDiv").css("background-color","white");
	$(".contactDiv").css("border","none");
	$(this).css("background-color",'#DDD');
	$(this).css("border",'2px solid gray');
	$(".tagSelected").removeClass("tagSelected");
	console.log(contactList);
	currentContact = contactList[$(this).attr("id").split("-")[1]];
	$("#contactNametoEdit").text(" for "+ currentContact.name);
	contactSelected = true;
	//clear out the space for tags before adding new one 
	$(".currentContactTags").remove();
	$("#selectLabels").before("<h4 class='currentContactTags'>No tags for this contact yet.</h4>");
	if(currentContact.tags.length > 0){
		$(".currentContactTags").empty();
		for (var i = 0; i < currentContact.tags.length; i++){
			$(".currentContactTags").append(currentContact.tags[i]+"  ");
		}
		highlightTags();
	} 

})

//selector for buttons clicked within the label div -- adding these to the contact's tags, if a contact has been selected
$(document.body).on("click","#selectLabels .label",function(){
	if (contactSelected === true){
		//if the tag is selected already, we want to remove it from the array and change the color back
		if ($(this).hasClass("tagSelected")){
			$(this).removeClass("tagSelected");
			var index = currentContact.tags.indexOf($(this).attr("data-name"));
			if (index >= 0){
				currentContact.tags.splice(index,1);
			}
			$(".currentContactTags").empty();
			for (var i = 0; i < currentContact.tags.length; i++){
				$(".currentContactTags").append(currentContact.tags[i]+"  ");
			}
			highlightTags();
			listActivities();
		}else{
			currentContact.tags.push($(this).attr("data-name"));
			//refreshing the section 
			$(".currentContactTags").empty();

			for (var i = 0; i < currentContact.tags.length; i++){

				$(".currentContactTags").append(currentContact.tags[i]+"  ");
			}
			highlightTags();
			listActivities();
		}
	}
})



//map search when activity button is clicked
$(document).on('click',".activity",function(){
		var name = this.id.slice(0,this.id.indexOf("|"));
		var tagToSearch = this.id.slice(this.id.indexOf("|")+1);
		console.log(name);
		console.log(tagToSearch);
		var areaToSearch;
		for (var i = 0; i < contactList.length; i++){
			if (name === contactList[i].name){
				areaToSearch = contactList[i].address;
			}
		}
		console.log(areaToSearch)
		//calling the create map function in the api.js file
		initMap(tagToSearch, areaToSearch);
	})


///////////////////////////////////////////////////////////







}

