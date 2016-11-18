//these two globals should be moved to the main js file
var map;
var infowindow;

//function to create map
function createMap(tagToSearch,area){
  function initMap() {
        //create a geocoder object
        geocoder = new google.maps.Geocoder();
        //placeholder latlng until we do the search
        var latlng = new google.maps.LatLng(53.3496, -6.3263);
        //set the initial bounds of the map, update when pins are dropped
        var bounds = new google.maps.LatLngBounds();

        //creating the map object - appending it to the map ID
        map = new google.maps.Map(document.getElementById('map'), {
          center: latlng,
          zoom: 12
        });

        //convert the string search into an address to search 
        geocoder.geocode( {address:area}, function(results, status) 
        {
          //if successful, 
          if (status == google.maps.GeocoderStatus.OK) 
          {
            //center the map over the result
            map.setCenter(results[0].geometry.location);

            //place a marker at the center of search area location
            var marker = new google.maps.Marker(
            {
                title:"Starting Location",
                animation: google.maps.Animation.DROP,
                map: map,
                position: results[0].geometry.location,
            });
            //icon for the starting point is green dot 
            marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
         }
         //displaying search results
        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        //make sure we're searching the right thing
        console.log(tagToSearch);
        //the actual search 
        service.textSearch({
          //using the location as found above
          location: results[0].geometry.location,
          radius: 500,
          query: tagToSearch
        }, callback);

        //in the callback we place a marker for each of the results
      function callback(results, status) {
        console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }
      //this creates markers for each of the search results
      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        //adjust the bounds of the map to fit all of the markers
        bounds.extend(placeLoc);
        map.fitBounds(bounds);
        //when a marker is clicked, show the info window
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent("<h3>"+place.name + " - Rating: "+ place.rating + "</h3><p>" + place.formatted_address +"</p>");
          infowindow.open(map, this);
        });

        };

        
      })
  
      }
}

var contactsList = [];
function getContacts(){
  //ajax call to get a list of contacts
  $.ajax({url:"https://people.googleapis.com/v1/{resourceName=people/me}/connections" method:"GET"}).done(function(response){
    console.log(response);
    //loop through the response and save off the name and do the address call
    for (var i = 0; i<response.connections.length; i++ ){
      var contactName = response.connections[i].names[0].displayName
      
      //save the resource name 
      var resourceName = response.connections[i].resourceName;
      //second ajax call to get the address - uses a different request
      $.ajax({url:"https://people.googleapis.com/v1/{resourceName=people/"+resourceName+"}" method:"GET"}).done(function(responseTwo){
        console.log (responseTwo);
        var address = responseTwo.addresses[0].formattedValue;

        //push an object of contact Name and contact address to the array contactList
        contactsList.push({contactName:contactName, contactAddress: address});
      }
    }

  })
}
