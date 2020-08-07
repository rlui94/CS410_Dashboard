//Used to set marker color in map layer based on magnitude
function chooseMagColor(value) {
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
            return "#000000";
    }
}
function chooseDepthColor(value) {
    switch(true) {
        case value <= 70:
            return "rgb(0, 200, 255)";
        case value <= 300:
            return "#0000ff";
        case value > 300:
            return "#800080";
        default:
            console.log(value);
            return "#000000";
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
    worldCopyJump: true,
    maxBounds: [[90,-225],[-90, 225]],
    maxBoundsViscosity: 1.0,
    bounceAtZoomLimits: false,
})
map.fitBounds([[70,-160],[-70, 160]]).invalidateSize();
let ctr = map.getCenter();

//Add map tile to container using Stamen Tile
var map_layer = new L.StamenTileLayer("toner");
map.addLayer(map_layer);

//Add magnitude markers to a map layer that can be added
//or removed. Includes popup info on marker.
var current = L.layerGroup().addTo(map);
var addMagMarkers = function(feature, latlng){
    return L.circleMarker(latlng, {
        radius: feature.properties.mag + map.getZoom(),
        color: chooseMagColor(feature.properties.mag),
        opacity: 0.7,
    }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"<br/>Magnitude: "+feature.properties.mag+"<br/>"+feature.properties.place+"</b></p>");
}

var addDepthMarkers = function(feature, latlng){
    return L.circleMarker(latlng, {
        radius: (feature.geometry.coordinates[2] / 100) + map.getZoom(),
        color: chooseDepthColor(feature.geometry.coordinates[2]),
        opacity: 0.7,
    }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"<br/>Magnitude: "+feature.properties.mag+"<br/>"+feature.properties.place+"</br>Depth: "+feature.geometry.coordinates[2]+"km</b></p>");
}

//Helper function to adjust markers on zoom
function markerAdjust(sublayer, zoom, stzoom){
    if(zoom > stzoom){
        return sublayer.options.radius + zoom;
    }
    else if(zoom < stzoom){
        return sublayer.options.radius - stzoom;
    }
    return sublayer.options.radius;
}

map.on("resize", function() {
    map.fitBounds([[70,-160],[-70, 160]]).invalidateSize();
})
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

//Default map display 1 day magnitude activity
var maxLoc = [];
apiInfo(url_day)
.then(data => {
    L.geoJSON(data, {
        pointToLayer: addMagMarkers,
    }).addTo(current);
})
.catch(reason => console.log(reason.message));

function displayMonth(request = "magnitude") {
    let markerFunction = addMagMarkers;
    if(request == "depth" || document.getElementById("depthTab").classList.contains("set")){
        markerFunction = addDepthMarkers;
    }
    current.clearLayers();
    apiInfo(url_month)
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: markerFunction,
        }).addTo(current);
    })
    .catch(reason => console.log(reason.message));
}

function displayWeek(request = "magnitude") {
    let markerFunction = addMagMarkers;
    if(request == "depth" || document.getElementById("depthTab").classList.contains("set")){
        markerFunction = addDepthMarkers;
    }
    current.clearLayers();
    apiInfo(url_week)
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: markerFunction
        }).addTo(current);
    })
    .catch(reason => console.log(reason.message));
}

function displayDay(request = "magnitude") {
    let markerFunction = addMagMarkers;
    if(request == "depth" || document.getElementById("depthTab").classList.contains("set")){
        markerFunction = addDepthMarkers;
    }
    current.clearLayers();
    apiInfo(url_day)
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: markerFunction
        }).addTo(current);
    })
    .catch(reason => console.log(reason.message));
}

function displayDepth() {
    document.getElementById("magTab").classList.remove("set");
    document.getElementById("depthTab").classList.add("set");
    document.getElementById("magLegend").classList.add("d-none");
    document.getElementById("depthLegend").classList.remove("d-none");
    var toggle = document.getElementById("toggleBar");
    var choice = toggle.getElementsByClassName("active");
    if(choice[0].id == "pastMonth"){
        displayMonth("depth");
    }
    else if(choice[0].id == "pastWeek"){
        displayWeek("depth");
    }
    else{
        displayDay("depth");
    }
}

function displayMag() {
    document.getElementById("depthTab").classList.remove("set");
    document.getElementById("magTab").classList.add("set");
    document.getElementById("depthLegend").classList.add("d-none");
    document.getElementById("magLegend").classList.remove("d-none");
    var toggle = document.getElementById("toggleBar");
    var choice = toggle.getElementsByClassName("active");
    if(choice[0].id == "pastMonth"){
        displayMonth();
    }
    else if(choice[0].id == "pastWeek"){
        displayWeek();
    }
    else {
        displayDay();
    }
}

if(document.getElementById("quickStats")){
    var findLargest = document.getElementById("largest");
    findLargest.addEventListener("click", function(event) {
        apiInfo(url_day)
        .then(data => {
            var curCtr = map.getCenter();
            var curZoom = map.getZoom();
            var maxLoc = findMax(data.features).loc;
            maxLoc.reverse();
            map.flyTo(maxLoc, 5);
            setTimeout(function(){map.flyTo(curCtr, curZoom)}, 4000);
        })
    })

    var showSig = document.getElementById("significant");
    showSig.addEventListener("click", function(event) {
        apiInfo(url_day_sig)
        .then(data => {
            let counter = 4000;
            map.flyTo(data.features[0].geometry.coordinates.slice(0,2).reverse(), 6);
            for(let i=1; i< data.features.length; ++i){
                setTimeout(function(){map.flyTo(data.features[i].geometry.coordinates.slice(0,2).reverse(), 6)}, 4000);
                counter += 4000;
            }
            setTimeout(function(){map.fitBounds([[70,-160],[-70, 160]]).invalidateSize()}, counter + 3000);
        })
    })
}

function zoomToUser() {
    var crosshair = document.getElementById("locate");
    if(crosshair.classList.contains("active")){
        crosshair.classList.remove("active");
        map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
        return;
    }
    crosshair.classList.add("active");
    map.locate({
        setView: true,
        maxZoom: 5
    })
}