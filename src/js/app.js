var app = {
  mapView: {}
};

app.Place = function(name, lat, lng) {
  var self = this;
  self.name = name;
  self.location = {
    lat: lat,
    lng: lng 
  };
  self.isVisible = true;
  self.isHighlighted = false;
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

ko.applyBindings(new app.PlacesViewModel());










