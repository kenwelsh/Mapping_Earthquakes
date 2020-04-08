// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([37.6213, -122.3790], 5);

// Coordinates for each point to be used in the polyline.
let line = [
	[33.9416, -118.4085],
	[37.6213, -122.3790],
	[40.7899, -111.9791],
	[47.4502, -122.3088]
  ];

// Create a polyline using the line coordinates and make the line red.
L.polyline(line, {
	color: "yellow"
}).addTo(map);

//  Add a marker to the map for Los Angeles, California.

// for L.circleMarker radius is in pixels
// let marker = L.circleMarker([34.0522, -118.2437], {
// 	color: 'black',
//   	fillColor: '#ffffa1',
//   	fillOpacity: 0.5,
//  	radius: 300
// })
// .addTo(map);

// radius is in meters
//let marker = L.circle([34.0522, -118.2437], {
// 	color: 'black',
//  fillColor: '#ffffa1',
//  fillOpacity: 0.5,
// 	radius: 300
// }).addTo(map);



// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
	// map styles
	// streets-v11
	// dark-v10
	// satellite-streets-v11

// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);