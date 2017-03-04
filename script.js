function initmap() {
	// a photo and location data should be changed/added in one-night-photos

	// create map object

	var starting_point = {lat: data[0]["lat"], lng: data[0]["lng"]};
	var myOptions = {
 	  //scrollwheel: false,
 	  //navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
	  //draggable: false,
         // zoomControl: false,
	  mapTypeId: google.maps.MapTypeId.ROADMAP};
	var map = new google.maps.Map(document.getElementById("map"), myOptions);

	 // panorama option
/*
	 var panorama = new google.maps.StreetViewPanorama(
 	 	document.getElementById('street_view'), {
    			position: starting_point,
      			pov: {
      				heading: 34, pitch: 0
     			 }
          });
  	map.setStreetView(panorama);    */

	// init directions service
	var dirService = new google.maps.DirectionsService();
	var dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
	dirRenderer.setMap(map);

	// highlight a street
	var first = data[0]['lat'] + "," + data[0]['lng'];
	var last = data[data.length-1]['lat'] + "," + data[data.length-1]['lng'];
	var waypts = [];
	for (var j=1, k = data.length-1; j < k; j++) {
		waypts.push({
			location: data[j]['lat'] + "," + data[j]['lng']
		});
	}
	var request = {
		origin: first,
		destination: last,
		waypoints: waypts,
		travelMode: google.maps.TravelMode.WALKING
	};
	dirService.route(request, function(result, status) {
 	 if (status == google.maps.DirectionsStatus.OK) {
 	   dirRenderer.setDirections(result);
	 }
	});

	buildMarkers(map);
}
var infos=[];

function buildMarkers(map) {
	var marker, i;

	// builds elements on map
	for (var i=0, l = data.length; i < l; i++) {
		// builds markers
		var markerOptions = {
   	 		position: {lat: data[i]["lat"], lng: data[i]["lng"]},
  	 		map: map,
		};
		var marker = new google.maps.Marker(markerOptions);
		// builds infoWindow for markers
		var content = '<a href=' + data[i]["image-path"] + ' data-lightbox=image' + i + ' > <img width="300px" border-radius="4px" src=' + data[i]["image-path"] + '> <p>'+data[i]["caption"]+'</a>' ;
		var infowindow = new google.maps.InfoWindow();

		// adds listener for markers
		google.maps.event.addListener(marker, 'click',
		(function(marker, content, infowindow) {
console.log('clicked');
			return function() {
				closeInfos();
				infowindow.setContent(content);
				infowindow.open(map,marker);

				infos[0]= infowindow;
			};
		})(marker, content, infowindow));
	}
}

function closeInfos(){
   if (infos.length > 0){

      // detach the info-window from the marker
      infos[0].set("marker", null);

      //  close
      infos[0].close();

      // clear array
      infos.length = 0;
   }
}
