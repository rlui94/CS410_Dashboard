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
//to human readable format
function parseTime(epochDate) {
    var date = new Date(epochDate)
    return date.toLocaleString()
}

//Create blank map container and set zoom
var map = new L.Map("map", {
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    minZoom: 1,
    worldCopyJump: true
})
map.fitWorld().zoomIn();
let ctr = map.getCenter();

//Add map tile to container using Stamen Tile
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
    }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"<br/>Magnitude: "+feature.properties.mag+"<br/>"+feature.properties.place+"</b></p>");
}

//Helper function to adjust markers on zoom
function markerAdjust(sublayer, zoom, stzoom){
    if(zoom > stzoom){
        return sublayer.options.radius * (zoom/3.3);
    }
    else {
        return sublayer.options.radius / (stzoom/3.3);
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

//Default map display 1 day activity
var maxLoc = [];
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

if(document.getElementById("quickStats")){
    var findLargest = document.getElementById("largest");
    findLargest.addEventListener("click", function(event) {
        apiInfo(url_day)
        .then(data => {
            var maxLoc = findMax(data.features).loc;
            maxLoc.reverse();
            map.flyTo(maxLoc, 5);
            setTimeout(function(){map.flyTo(ctr, 1.5)}, 3000);
        })
    })

    var showSig = document.getElementById("significant");
    showSig.addEventListener("click", function(event) {
        apiInfo(url_day_sig)
        .then(data => {
            for(feature of data.features){
                map.flyTo(feature.geometry.coordinates.slice(0,2).reverse(), 5);
                setTimeout(function(){map.flyTo(ctr, 1.5)}, 3000);
            }
        })
    })
}