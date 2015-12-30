/**
 * Returns an object that contains data and utility methods to manage the map
 * @returns {Object} - mapView instance
 */
function getMapView() {
  var mapView = {};
  
  mapView.map = null;

  mapView.bounds = new google.maps.LatLngBounds();

  mapView.center = {
    lat: 37.4107, 
    lng: -122.0593
  };

  /**
   * Calculates the center of the map and stores it
   */
  mapView.calculateCenter = function() {
    mapView.center = mapView.map.getCenter();
  };

  /**
   * Initializes the map
   * Binds event handlers, re-centers the map on window resize
   */
  mapView.initMap = function() {
    // Create a map object and specify the DOM element for display.
    mapView.map = new google.maps.Map(document.getElementById('map'), {
      center: mapView.center,
      scrollwheel: false,
      zoom: 12
    });

    google.maps.event.addDomListener(mapView.map, 'idle', function() {
      mapView.calculateCenter();    
    });
    
    google.maps.event.addDomListener(window, 'resize', function() {
      mapView.map.setCenter(mapView.center);
    });
  };

  /**
   * Returns map object
   */
  mapView.getMap = function() {
    return mapView.map;
  };

  /**
   * Adds a coordinate to the map bounds
   */
  mapView.extendBounds = function(lat, lng) {
    mapView.bounds.extend(new google.maps.LatLng(lat, lng));    
  };

  /**
   * Calculate center from included coordinates
   */
  mapView.fitBounds = function() {
    mapView.map.fitBounds(mapView.bounds);
    mapView.map.setCenter(mapView.map.getCenter());
  }

  return mapView;
}