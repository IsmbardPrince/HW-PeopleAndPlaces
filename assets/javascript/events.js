// Start the app up when everything is loaded
$(document).ready(function(){

	// Create the main app object
	user =  new pnpUser();

	// And the service objects
	people = new pnpPeople(); // service object for the Google People API
	tagsDB = new pnpTags(); // service object for Firebase db holding the contact tags

	// And finally we load the initial data into the DOM here
	loadInitData();

})



/////////////////////ON CLICK EVENTS///////////////////////////////////////////////////

//This function adds user inputed labels to the labelArray

$("#addLabelButton").on("click", function(){

	//Captures the user input value and puts into a variable
	var label = $('#labelBox').val().trim();

	//Pushes the variable into an array
	labelsArray.push(label);

	//save the array into firebase
	user.saveTags(labelsArray);

	//Console logs the array for development purposes
	console.log(labelsArray);
	
	//Calls the render labels function
	renderLabels();
	highlightTags();
	
	//Prevents the form from discarding the console.log 
	event.preventDefault();

});



// selecting a contact to edit tags

$(document.body).on("click",".contactDiv",function(){
	//make sure colors are reset
	$(".contactDiv").css("background-color","white");
	$(".contactDiv").css("border","none");
	//change for selection
	$(this).css("background-color",'#DDD');
	$(".tagSelected").removeClass("tagSelected");
	//reset the labels array with the user's own tags
	if(user.userTags.length>0){
		labelsArray = user.userTags;
		renderLabels();
	}
	//save the current contact
	currentContact = contactList[$(this).attr("id").split("-")[1]];
	$("#contactNametoEdit").text(" for "+ currentContact.name);
	contactSelected = true;
	//clear out the space for tags before adding new one 
	$(".currentContactTags").remove();
	$("#labelsDiv").remove();
	$("#tagInstructions").before("<div class='panel-body' id='labelsDiv'><h4 class='currentContactTags'>No tags for this contact yet.</h4></div>");
	//add the save tags button
	$("#saveTags").remove();
	$(".currentContactTags").after("<button id='saveTags'>Save Tags</button>");
	$("p.hidden.instructions").removeClass("hidden");
	//show the tags if they exist
	if(currentContact.tags.length > 0){
		$(".currentContactTags").empty();
		for (var i = 0; i < currentContact.tags.length; i++){
			if (i != currentContact.tags.length-1){
				$(".currentContactTags").append(currentContact.tags[i]+",  ");
			} else{
				$(".currentContactTags").append(currentContact.tags[i]);
			}
			
		}
		//highlight any active tags
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
				if (i != currentContact.tags.length-1){
					$(".currentContactTags").append(currentContact.tags[i]+",  ");
				} else{
					$(".currentContactTags").append(currentContact.tags[i]);
				}
			}
			highlightTags();
			listActivities();
		}else{
			currentContact.tags.push($(this).attr("data-name"));
			//refreshing the section 
			$(".currentContactTags").empty();

			for (var i = 0; i < currentContact.tags.length; i++){
				if (i != currentContact.tags.length-1){
					$(".currentContactTags").append(currentContact.tags[i]+",  ");
				} else{
					$(".currentContactTags").append(currentContact.tags[i]);
				}
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
		$("p.hidden").removeClass('hidden');
		//calling the create map function in the api.js file
		initMap(tagToSearch, areaToSearch);

		var link = $("#backToTop").detach();
		$("#weather").after(link);
	})

//save tags - send to firebase
$(document.body).on("click","#saveTags", function(){
	currentContact.addTags(currentContact.tags);
	});

///////////////////////////////////////////////////////////

//show activities when doStuff is clicked
$("#doStuffLink").on("click",function(){
	listActivities();
	$(".hiddenArea").removeClass("hiddenArea");
	$("html, body").animate({ scrollTop: $('#doStuff').offset().top }, 1500);
})

//back to top link

$("#backToTop").on("click",function(){
	$("html, body").animate({ scrollTop: 0 }, 1000);
})




