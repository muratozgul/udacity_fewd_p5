var app = {
  mapView: {}
};

app.Place = function(name, lat, lng, parent) {
  var self = this;

  self.parent = ko.observable(parent);

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

  self.addMarker = function(){
    self.marker.setMap(map);
  }

  self.removeMarker = function(){
    self.marker.setMap(null);
  }

  self.showMarker = function(){
    self.marker.setVisible(true);
  }

  self.hideMarker = function(){
    self.marker.setVisible(false);
  }

  self.centerOnMap = function(){
    map.setCenter(self.marker.getPosition());
  }

  self.isVisible.subscribe(function(currentState) {
    if (currentState) {
      self.showMarker();
    } else {
      self.hideMarker();
    }
  });

  self.isHighlighted.subscribe(function(currentState) {
    if (self.isSelected()) {
      self.marker.setIcon(self.markerIcons.GREEN);
    } else if (currentState) {
      self.marker.setIcon(self.markerIcons.YELLOW);
    } else {
      self.marker.setIcon(self.markerIcons.RED);
    }
  });

  self.isSelected.subscribe(function(currentState) {
    if (currentState) {
      self.$el().addClass("selected");
      self.marker.setIcon(self.markerIcons.GREEN);
      self.infoWindow.open(map, self.marker);
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

  self.mouseOver = function(){
    self.isHighlighted(true);
  }

  self.mouseOut = function(){
    self.isHighlighted(false);
  }

  self.mouseClick = function(){
    var parent = self.parent();
    parent.clearSelection();
    self.isSelected(true);
    self.bounce(1500);

    //Make api call
    console.log("Making YELP API call...");
    parent.yelpApi.search();
  }

  self.contentString = "Place: " + self.name;

  self.infoWindow = new google.maps.InfoWindow({
    content: self.contentString
  });

  self.bounce = function(duration) {
    self.marker.setAnimation(google.maps.Animation.BOUNCE);

    window.setTimeout(function(duration) {
      self.marker.setAnimation(null);      
    }, duration);
  }

  self.marker.addListener('click', function() {
    self.mouseClick();
  });

  self.isVisible(true);
  self.isHighlighted(false);
}




app.PlacesViewModel = function() {
  var self = this;

  self.defaultData = [
    { name: "CMU", lat: 37.4107, lng: -122.0593 },
    { name: "Stanford", lat: 38.4107, lng: -123.0593 }
  ];

  self.places = ko.observableArray([]);

  self.addPlace = function(place) {
    self.places.push(place);
  };
  
  self.removePlace = function(place) { 
    self.seats.remove(seat) 
  };

  self.currentFilter = ko.observable();

  self.filteredPlaces = ko.computed(function() {
    if(!self.currentFilter()) {
      ko.utils.arrayForEach(self.places(), function(place) {
        place.isVisible(true);
      });
      return self.places(); 
    } else {
      var filter = self.currentFilter();
      var regex = new RegExp(filter);
      return ko.utils.arrayFilter(self.places(), function(place) {
        var isMatch = regex.test(place.name);
        place.isVisible(isMatch);
        return isMatch;
      });
    }
  });

  self.clearSelection= function() {
    ko.utils.arrayForEach(self.places(), function(place) {
      place.isSelected(false);
    });
  }

  // yelp.js
  self.yelpApi = yelpAPI();
  console.dir(self.yelpApi);

  // Dummy init for test
  self.defaultData.forEach(function(data, index, array){
    self.addPlace(new app.Place(data.name, data.lat, data.lng, self));
  });
}

ko.bindingHandlers.el = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called when the binding is first applied to an element
    // Set up any initial state, event handlers, etc. here
    var value = valueAccessor();
    value(element);
  }
};

ko.bindingHandlers.$el = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    // This will be called when the binding is first applied to an element
    // Set up any initial state, event handlers, etc. here
    var value = valueAccessor();
    value($(element).first());
  }
};


function initMap(){
  app.mapView = getMapView();
  app.mapView.initMap();
  ko.applyBindings(new app.PlacesViewModel());
}











