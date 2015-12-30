var app = {
  mapView: {}
};

/**
 * Wraps Place generator for creating and modifying places easily
 * @param {Object} data - Yelp data of business
 * @param {Object} parent - Reference to PlacesViewModel
 * @returns {Object} - Place object created from Yelp data
 */
app.PlaceFactory = function(data, parent) {
  var coord = data.location.coordinate;
  var place = new app.Place(data.name, coord.latitude, coord.longitude, data, parent);
  return place;
};

/**
 * Place object.
 * @param {string} name - name of the business
 * @param {Number} lat - latitude
 * @param {Number} lng - longitude
 * @param {Object} yelpData - Yelp data of business
 * @param {Object} parent - Reference to PlacesViewModel
 * @class
 */
app.Place = function(name, lat, lng, yelpData, parent) {
  var self = this;

  self.parent = ko.observable(parent);

  self.yelpData = yelpData;

  self.name = name;
  self.position = {
    lat: lat,
    lng: lng 
  };
  self.isVisible = ko.observable(false);
  self.isHighlighted = ko.observable(false);
  self.isSelected = ko.observable(false);

  self.el = ko.observable();

  self.$el = ko.observable();

  var map = app.mapView.getMap();

  self.markerIcons = {
    RED: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    YELLOW: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    GREEN: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  };

  self.marker = new google.maps.Marker({
    map: map,
    position: self.position,
    title: self.name,
    icon: self.markerIcons.RED,
    animation: null
  });

  app.mapView.extendBounds(self.position.lat, self.position.lng);

  self.contentString = self.name + " (rating: " + self.yelpData.rating + ")";

  self.infoWindow = new google.maps.InfoWindow({
    content: self.contentString
  });

  /**
   * Add place marker to the map
   */
  self.addMarker = function(){
    self.marker.setMap(map);
  }

  /**
   * Remove place marker from the map
   */
  self.removeMarker = function(){
    self.marker.setMap(null);
  }

  /**
   * Show place marker in the map
   */
  self.showMarker = function(){
    self.marker.setVisible(true);
  }

  /**
   * Hide place marker in the map
   */
  self.hideMarker = function(){
    self.marker.setVisible(false);
  }

  /**
   * Center the map on place marker
   */
  self.centerOnMap = function(){
    map.setCenter(self.marker.getPosition());
  }

  self.isVisible.subscribe(function(currentState) {
    if (currentState) {
      self.showMarker();
    } else {
      self.infoWindow.close();
      self.hideMarker();
      self.isSelected(false);
      self.parent().selectedPlace(null);
    }
  });

  self.isHighlighted.subscribe(function(currentState) {
    if (self.isSelected()) {
      self.$el().removeClass("highlighted");
      self.marker.setIcon(self.markerIcons.GREEN);
      
    } else if (currentState) {
      self.$el().addClass("highlighted");
      self.marker.setIcon(self.markerIcons.YELLOW);

    } else {
      self.$el().removeClass("highlighted");
      self.marker.setIcon(self.markerIcons.RED);
    }
  });

  self.isSelected.subscribe(function(currentState) {
    if (currentState) {
      self.$el().addClass("selected");
      self.marker.setIcon(self.markerIcons.GREEN);
      self.infoWindow.open(map, self.marker);
      self.parent().selectedPlace(self);

    } else {
      self.$el().removeClass("selected");
      self.infoWindow.close();

      if(self.isHighlighted()) {
        self.marker.setIcon(self.markerIcons.YELLOW);
      } else {
        self.marker.setIcon(self.markerIcons.RED);
      }
    }
  });

  /**
   * Highlight when mouse is over
   */
  self.mouseOver = function(){
    self.isHighlighted(true);
  }

  /**
   * Remove highlight when mouse is out
   */
  self.mouseOut = function(){
    self.isHighlighted(false);
  }

  /**
   * Select when clicked and animate marker
   */
  self.mouseClick = function(){
    var parent = self.parent();
    parent.clearSelection();
    self.isSelected(true);
    self.bounce(1400);    
  }

  /**
   * Animate marker by bouncing
   * @param {Number} duration - millisecond of bounce
   */
  self.bounce = function(duration) {
    self.marker.setAnimation(google.maps.Animation.BOUNCE);

    window.setTimeout(function(duration) {
      self.marker.setAnimation(null);      
    }, duration);
  }

  self.marker.addListener('click', function() {
    self.mouseClick();
  });

  self.marker.addListener('mouseover', function() {
    self.mouseOver();
  });

  self.marker.addListener('mouseout', function() {
    self.mouseOut();
  });

  self.isVisible(true);
  self.isHighlighted(false);
}

/**
 * PlacesViewModel - Main "controller" for the app
 * @class
 */
app.PlacesViewModel = function() {
  var self = this;

  // Get yelpApi helper (yelp.js)
  self.yelpApi = yelpAPI();

  /**
   * Gets data of 9 restaurants around Mountain View from Yelp API
   * @param {Function} callback - will be called with yelp Api response as argument
   */
  self.fetchYelpData = function(callback) {
    var url = self.yelpApi.searchUrlBuilder("Restaurant", "Mountain View, CA", 9);
    self.yelpApi.search(url, callback);
  };

  self.places = ko.observableArray([]);

  self.selectedPlace = ko.observable();

  /**
   * Add a place instance to the places collection
   * @param {Object} place - place object
   */
  self.addPlace = function(place) {
    self.places.push(place);
  };

  /**
   * Remove a place instance from the places collection
   * @param {Object} place - place object
   */
  self.removePlace = function(place) { 
    self.seats.remove(seat) 
  };

  self.currentFilter = ko.observable();

  self.filteredPlaces = ko.computed(function() {
    if(!self.currentFilter()) {
      // display all if there is no filter
      ko.utils.arrayForEach(self.places(), function(place) {
        place.isVisible(true);
      });
      return self.places(); 
    } else {
      // use regex to find filter string inside place name
      var filter = self.currentFilter();
      var regex = new RegExp(filter);
      return ko.utils.arrayFilter(self.places(), function(place) {
        var isMatch = regex.test(place.name);
        place.isVisible(isMatch);
        return isMatch;
      });
    }
  });

  /**
   * Clear the selected place by unselecting all
   */
  self.clearSelection = function() {
    ko.utils.arrayForEach(self.places(), function(place) {
      place.isSelected(false);
    });
  };

  self.fetchYelpData(function(data) {
    // Populate places array with place object generated from business data
    data.businesses.forEach(function(data, index, array){
      self.addPlace(new app.PlaceFactory(data, self));
    });
    // Center map around markers
    app.mapView.fitBounds();
  });
  
}

/**
 * Bind the DOM element, so it is easily accesible
 */
ko.bindingHandlers.el = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var value = valueAccessor();
    value(element);
  }
};

/**
 * Bind jQuery object of DOM element, so it is easily accesible
 */
ko.bindingHandlers.$el = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var value = valueAccessor();
    value($(element).first());
  }
};

/**
 * Start application
 */
function initMap(){
  app.mapView = getMapView();
  app.mapView.initMap();
  ko.applyBindings(new app.PlacesViewModel());
}
