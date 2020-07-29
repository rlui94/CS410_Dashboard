/*
//URLs for monthly, weekly, and daily earthquake geoJSON info
const url_month = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const url_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url_day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//API access function
async function apiInfo(url){
    let response = await fetch(url);
    if(response.status == 200){
        let data = await response.json();
        console.log(data);
        return data;
    }
    throw new Error(response.status);
};
*/

//Used to set marker color in map layer based on magnitude
function chooseColor(value) {
    switch (true){
        case value < 3:
            return "rgb(0, 255, 0)";
        case value < 6:
            return "rgb(255, 255, 0)";
        case value < 8:
            return "rgb(255, 0, 0)";
        case value >= 8:
            return "rgb(255, 0, 255)";
        default:
            console.log(value);
            return "blue";
    }
}



//Used to translate date/time from geoJSON file
//to human readable GMT format
function parseTime(epochDate) {
    var date = new Date(epochDate)
    return date.toLocaleString()
}

//Create blank map container
var map = new L.Map("map", {
    center: new L.LatLng(10, 25),
    zoomSnap: 0.5,
    minZoom: 0.5,
    worldCopyJump: true
})
map.fitWorld().zoomIn();
console.log(map.getZoom());


//Add map to container using Stamen Tile
var map_layer = new L.StamenTileLayer("toner");
map.addLayer(map_layer);

//Add markers to a map layer that can be added
//or removed. Includes popup info on marker.
var current = L.layerGroup().addTo(map);
var addMarkers = function(feature, latlng){
    return L.circleMarker(latlng, {
        radius: feature.properties.mag,
        color: chooseColor(feature.properties.mag),
        opacity: 0.3,
    }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"</b><br/><b>Magnitude: "+feature.properties.mag+"</b></p>");
}

//Default map display(30 days)
apiInfo(url_day)
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: addMarkers,
        }).addTo(current);
    })
    .catch(reason => console.log(reason.message));

if(document.getElementById("toggleBar")){
    //Displays monthly info when pastMonth toggle is clicked
    var monthToggle = document.getElementById("pastMonth");
    monthToggle.addEventListener("click", function(event) {
        if(!monthToggle.classList.contains("active")){
            current.clearLayers();
            apiInfo(url_month)
            .then(data => {
                L.geoJSON(data, {
                    pointToLayer: addMarkers,
                }).addTo(current);
            })
            .catch(reason => console.log(reason.message));
        }
    });

    //Displays weekly info on when pastWeek on toggle is clicked
    var weekToggle = document.getElementById("pastWeek");
    weekToggle.addEventListener("click", function(event) {
        if(!weekToggle.classList.contains("active")){
            current.clearLayers();
            apiInfo(url_week)
            .then(data => {
                L.geoJSON(data, {
                    pointToLayer: addMarkers,
                }).addTo(current);
            })
            .catch(reason => console.log(reason.message));
        }
    });

    //Displays daily info when today on toggle is clicked
    var dayToggle = document.getElementById("today");
    dayToggle.addEventListener("click", function(event) {
        if(!dayToggle.classList.contains("active")){
            current.clearLayers();
            apiInfo(url_day)
            .then(data => {
                L.geoJSON(data, {
                    pointToLayer: addMarkers,
                }).addTo(current);
            })
            .catch(reason => console.log(reason.message));
        }
    });
}
//Helper function to adjust markers on zoom
function markerAdjust(sublayer, zoom, stzoom){
    if(zoom > stzoom){
        return sublayer.options.radius * (zoom/3.0);
    }
    else {
        return sublayer.options.radius / (stzoom/3.0);
    }
}

//Capture where zoom in/out starts
var stzoom = 0;
map.on("zoomstart", function() {
    stzoom = map.getZoom();
});

//Adjust size of markers based on zoom level
map.on("zoomend", function() {
    var zoom = map.getZoom();
    current.eachLayer(function(layer){
        layer.eachLayer(function(sublayer){
                sublayer.setStyle({radius: markerAdjust(sublayer, zoom, stzoom)});
        })
    })
});