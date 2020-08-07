

//Create blank map container and set zoom
var map = new L.Map("map", {
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    minZoom: 1,
    worldCopyJump: true,
    maxBounds: [[90,-225], [-90, 225]],
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
        return sublayer.options.radius + (zoom - stzoom);
    }
    else if(zoom < stzoom){
        return sublayer.options.radius - (stzoom - zoom);
    }
    return sublayer.options.radius;
}

//When map is resized, fit the whole globe in bounds
map.on("resize", function() {
    map.fitBounds([[70,-160],[-70, 160]]).invalidateSize();
})

//Capture where zoom in/out starts
var stzoom = 0;
map.on("zoomstart", function() {
    stzoom = map.getZoom();
});

//Adjust size of markers based on zoom level when zoom ends
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
    if(document.getElementById("depthTab")){
        if(request == "depth" || document.getElementById("depthTab").classList.contains("set")){
         markerFunction = addDepthMarkers;
        }
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
    if(document.getElementById("depthTab")){
        if(request == "depth" || document.getElementById("depthTab").classList.contains("set")){
            markerFunction = addDepthMarkers;
        }
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
    if(document.getElementById("depthTab")){
        if(request == "depth" || document.getElementById("depthTab").classList.contains("set")){
            markerFunction = addDepthMarkers;
        }
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
        .catch(reason => console.log(reason.message));
    })

    var showSig = document.getElementById("significant");
    showSig.addEventListener("click", function(event) {
        let sigUrl = url_day_sig;
        if(document.getElementById("showMonth").classList.contains("d-none")){
            sigUrl = url_month_sig;
        }
        else if(document.getElementById("showWeek").classList.contains("d-none")){
            sigUrl = url_week_sig;
        }
        apiInfo(sigUrl)
        .then(data => {
            console.log(data.features);
            let i = 1;
            map.flyTo(data.features[0].geometry.coordinates.slice(0,2).reverse(), 6);
            var popup = L.popup()
                .setLatLng(data.features[0].geometry.coordinates.slice(0,2).reverse())
                .setContent("<p><b>"+parseTime(data.features[0].properties.time)+"<br/>Magnitude: "+data.features[0].properties.mag+"<br/>"+data.features[0].properties.place+"</b></p>")
                .openOn(map);
            let flyInterval = setInterval(function(){
                if(i >= data.features.length){
                    map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
                    map.closePopup();
                    clearInterval(flyInterval);
                    return;
                }
                map.flyTo(data.features[i].geometry.coordinates.slice(0,2).reverse(), 6);
                popup = L.popup()
                    .setLatLng(data.features[i].geometry.coordinates.slice(0,2).reverse())
                    .setContent("<p><b>"+parseTime(data.features[i].properties.time)+"<br/>Magnitude: "+data.features[i].properties.mag+"<br/>"+data.features[i].properties.place+"</b></p>")
                    .openOn(map);
                i++;
            }, 4500);
        })
        .catch(reason => console.log(reason.message));
    })
}


//Throws error message on locationError
function onLocationError(e){
    alert(e.message);
}

//Zooms to user location on locationFound
function onLocationFound(e){
    console.log(e.latlng);
    map.flyTo(e.latlng, 5);
    document.getElementById("locate").classList.add("active");
    document.getElementById("locateText").textContent= "Zoom to Earth View";
}

//Gets user location and changes button to active
function zoomToUser() {
    var crosshair = document.getElementById("locate");
    if(crosshair.classList.contains("active")){
        document.getElementById("locateText").textContent= "Zoom to Your Location";
        crosshair.classList.remove("active");
        map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
        return;
    }
    map.locate();
    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
}

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