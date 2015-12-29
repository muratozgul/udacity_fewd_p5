function getMapView() {
  var mapView = {};
  
  mapView.map = null;

  mapView.bounds = null;

  mapView.initMap = function() {
    // Create a map object and specify the DOM element for display.
    mapView.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 37.4107, 
        lng: -122.0593
      },
      scrollwheel: false,
      zoom: 12
    });

    mapView.bounds = new google.maps.LatLngBounds();
  };

  mapView.getMap = function(){
    return mapView.map;
  };

  mapView.createMarker = function(data){
    var lat = data.lat;
    var lng = data.lng;
    var name = data.name;

    var marker = new google.maps.Marker({
      map: mapView.map,
      position: {
        lat: lat,
        lng: lng
      },
      title: name
    });

    // this.bounds.extend(new google.maps.LatLng(lat, lng));
    // this.map.fitBounds(this.bounds);
    // this.map.setCenter(this.bounds.getCenter());
  };

  return mapView;
}

