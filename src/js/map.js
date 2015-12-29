function initMap(){
  app.mapView.initMap();
}

app.mapView.map = null;
app.mapView.bounds = null;
app.mapView.initMap = function() {
  // Create a map object and specify the DOM element for display.
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 37.4107, 
      lng: -122.0593
    },
    scrollwheel: false,
    zoom: 12
  });

  this.bounds = new google.maps.LatLngBounds();
};

app.mapView.getMap = function(){
  return this.map;
};

app.mapView.createMarker = function(data){
  var lat = data.lat;
  var lng = data.lng;
  var name = data.name;

  var marker = new google.maps.Marker({
    map: self.map,
    position: {
      lat: lat,
      lng: lng
    },
    title: name
  });

  this.bounds.extend(new google.maps.LatLng(lat, lng));
  this.map.fitBounds(this.bounds);
  this.map.setCenter(this.bounds.getCenter());
};