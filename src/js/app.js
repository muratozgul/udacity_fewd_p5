var app = {
  mapView: {}
};

app.Place = function(name, lat, lng) {
  var self = this;

  self.name = name;
  self.position = {
    lat: lat,
    lng: lng 
  };
  self.isVisible = true;
  self.isHighlighted = false;

  var map = app.mapView.getMap();

  self.marker = new google.maps.Marker({
    map: map,
    position: self.position,
    title: self.name
  });

  self.addMarker = function(){
    self.marker.setMap(map);
  }

  self.removeMarker = function(){
    self.marker.setMap(null);
  }
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

  // Dummy init for test
  self.defaultData.forEach(function(data, index, array){
    self.addPlace(new app.Place(data.name, data.lat, data.lng));  
  });
}

ko.bindingHandlers.placeItem = {
  init: function(element, valueAccessor) {
    $(element).addClass("placeItem");
    
    $(element).hover(
      function() { 
        console.log("Hover");
        console.dir(this);
      }, 
      function() { 
        console.log("Hover end");
        console.dir(this);
      }
    ).click(function() { 
      console.log("Clicked");
      console.dir(this);
    });
  },
  update: function(element, valueAccessor) {
    // Give the first x stars the "chosen" class, where x <= rating
    var observable = valueAccessor();
    $("span", element).each(function(index) {
      $(this).toggleClass("chosen", index < observable());
    });
  }
};

function initMap(){
  app.mapView = getMapView();
  app.mapView.initMap();
  ko.applyBindings(new app.PlacesViewModel());
}












