// create the street tile layer that will be an option for the map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// create the dark view tile layer that will be an option for the map
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// create the outdoor view tile layer that will be an option for the map
let comic = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.comic',
	accessToken: API_KEY
});

// create a base layer that holds all map options
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets,
    "Comic": comic
};

// create the earthquake layer for the map
let earthquakes = new L.layerGroup();

// create the tectonic plate layer for the map
let tectonicPlates = new L.layerGroup();

// define an object that contains the map overlays
let overlays = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
})

// pass map layers into the layers control and add the layers control to the map
L.control.layers(baseMaps, overlays).addTo(map);

// access the USGS Past 7 Days Earthquake GeoJSON URL
let earthquakesData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// grabbing the Eathquake GeoJSON data
d3.json(earthquakesData).then(function(data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into a function
  // to calculate the radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the circle based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {

    // turn each feature into a circleMarker on the map
    pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
    },
    // set the style for each circleMarker using the styleInfo function
    style: styleInfo,

    // create a popup for each circleMarker to display the magnitude and
    // location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  // add earthquake data to earthquake overlay  
  }).addTo(earthquakes);

  // add overlay to map
  earthquakes.addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // then add all the details for the legend
  legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
      labels = [];
  
    // looping through the intervals to generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+'); 
    }
    
    return div;
  };

  legend.addTo(map);

});

// access the Tectonic Plate GeoJSON URL
let tectonicPlateData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";  

// create a style for the lines
let myLineStyle = {
	color: "#DC143C",
	weight: 3
}

// grab the GeoJSON data
d3.json(tectonicPlateData).then(function(dataPlate) {

  // create the tectonic plate layer with the retrieved data
  L.geoJson(dataPlate, {style: myLineStyle})
  .addTo(tectonicPlates);
  
  //add tectonic plate layer to map
  tectonicPlates.addTo(map)
});



