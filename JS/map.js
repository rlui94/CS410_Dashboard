
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

//Returns magnitude markers and popup details to pointToLayer option
//when creating geoJSON layer
//current holds layer on map to be added and removed
var current = L.layerGroup().addTo(map);
var addMagMarkers = function(feature, latlng){
    return L.circleMarker(latlng, {
        radius: feature.properties.mag + map.getZoom(),
        color: chooseMagColor(feature.properties.mag),
        opacity: 0.7,
    }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"<br/>Magnitude: "+feature.properties.mag+"<br/>"+feature.properties.place+"</b></p>");
}

//Returns depth markers and popup details to pointToLayer option when
//creating geoJSON layer
var addDepthMarkers = function(feature, latlng){
    return L.circleMarker(latlng, {
        radius: (feature.geometry.coordinates[2] / 100) + map.getZoom(),
        color: chooseDepthColor(feature.geometry.coordinates[2]),
        opacity: 0.7,
    }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"<br/>Magnitude: "+feature.properties.mag+"<br/>"+feature.properties.place+"</br>Depth: "+feature.geometry.coordinates[2]+"km</b></p>");
}

//When map is resized, fit the whole globe in bounds
map.on("resize", function() {
    if(document.getElementById("locate").classList.contains("active")){
        return;
    }
    map.fitBounds([[70,-160],[-70, 160]]).invalidateSize();
})

//Helper function to adjust markers on zoom
//used by map.on("zoomend", function())
function markerAdjust(sublayer, zoom, stzoom){
    if(zoom > stzoom){
        return sublayer.options.radius + (zoom - stzoom);
    }
    else if(zoom < stzoom){
        return sublayer.options.radius - (stzoom - zoom);
    }
    return sublayer.options.radius;
}

//Capture where zoom in/out starts for marker adjustment
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
//calls USGS api
var maxLoc = [];
apiInfo(url_day)
.then(data => {
    L.geoJSON(data, {
        pointToLayer: addMagMarkers,
    }).addTo(current);
})
.catch(reason => console.log(reason.message));

//onclick event from id="pastMonth"
//Displays mag or depth based on id=mapTabs selection
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

//onclick event from id="pastWeek"
//Displays mag or depth based on id=mapTabs selection
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

//onclick event from id="today"
//Displays mag or depth based on id=mapTabs selection
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

//onclick event from id=plateTab
//Adds depth markers to map based on id=toggleBar selection
//calls {dispayMonth() | displayWeek() | displayDay()}
function displayDepth() {
    document.getElementById("magTab").classList.remove("set");
    document.getElementById("depthTab").classList.add("set");
    document.getElementById("magLegend").classList.add("d-none");
    document.getElementById("depthLegend").classList.remove("d-none");
    var toggle = document.getElementById("toggleBar");
    toggle.classList.remove("d-none");
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

//onclick event from id=plateTab
//Adds tectonic plate oulines to map
//hides toggleBar functions
//calls USGS api
function displayPlates() {
    document.getElementById("toggleBar").classList.add("d-none");
    document.getElementById("magLegend").classList.add("d-none");
    document.getElementById("depthLegend").classList.add("d-none");
    current.clearLayers();
    apiInfo("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
    .then(data => {
        L.geoJSON(data, {
            color: "red",
            weight: 2
        }).addTo(current);
    })
    .catch(reason => console.log(reason.message));
}

//onclick event from id=depthTab
//displays magnitude markers on map based on id=toggleBar selection
//calls {displayMonth() | displayWeek() | displayDay()}
function displayMag() {
    document.getElementById("depthTab").classList.remove("set");
    document.getElementById("magTab").classList.add("set");
    document.getElementById("depthLegend").classList.add("d-none");
    document.getElementById("magLegend").classList.remove("d-none");
    var toggle = document.getElementById("toggleBar");
    toggle.classList.remove("d-none");
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

//onclick event from  id=largest
//Selects api url based on dropdownButton selection
//Adds pop-up detail to marker and zooms/pans to location on map
//calls USGS api
function zoomToMax() {
    document.getElementById("mapContainer").scrollIntoView({behavior: 'smooth'});
    let maxUrl = url_day;
    if(document.getElementById("showMonth").classList.contains("d-none")){
        maxUrl = url_month;
    }
    else if(document.getElementById("showWeek").classList.contains("d-none")){
        maxUrl = url_week;
    }
    else if(document.getElementById("showMe").classList.contains("d-none")){
        map.locate();
        map.on("locationerror", function(e){
            onLocationError(e);
        });
        map.on("locationfound", function(e){
            let queryUrl;
            let weekAgo = new Date();
            pastDate = weekAgo.getDate() - 7;
            weekAgo.setDate(pastDate);
            let dateString = weekAgo.getFullYear() + "-" + (weekAgo.getMonth()+1) + "-" + weekAgo.getDate();
            queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime="+ dateString + "&latitude=" + e.latlng.lat +"&longitude=" + e.latlng.lng + "&maxradius=5";
            apiInfo(queryUrl)
            .then(data => {
                var max = findMax(data.features);
                L.popup()
                    .setLatLng(max.geometry.coordinates.slice(0,2).reverse())
                    .setContent("<p><b>" + parseTime(max.properties.time) + "<br/>Magnitude: "+ max.properties.mag + "<br/>" + max.properties.place + "</b></p>")
                    .openOn(map);
                setTimeout(function(){map.closePopup();}, 4000);
            })
            .catch(reason => console.log(reason.message));
        });
        return;
    }
    apiInfo(maxUrl)
    .then(data => {
        var max = findMax(data.features);
        L.popup()
            .setLatLng(max.geometry.coordinates.slice(0,2).reverse())
            .setContent("<p><b>" + parseTime(max.properties.time) + "<br/>Magnitude: "+ max.properties.mag + "<br/>" + max.properties.place + "</b></p>")
            .openOn(map);
        map.flyTo(max.geometry.coordinates.slice(0,2).reverse(), 5);
        setTimeout(function(){
            map.closePopup();
            map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
        }, 4000);
    })
    .catch(reason => console.log(reason.message));
}

//onclick event from id=significant
//Selects api url to access based on dropdownButton selection
//Adds pop-up details and zooms/pans to significant quakes at 4s interval
//calls USGS api
function zoomToSig() {
    document.getElementById("mapContainer").scrollIntoView({behavior: 'smooth'});
    let sigUrl = url_day_sig;
    if(document.getElementById("showMonth").classList.contains("d-none")){
        sigUrl = url_month_sig;
    }
    else if(document.getElementById("showWeek").classList.contains("d-none")){
        sigUrl = url_week_sig;
    }
    else if(document.getElementById("showMe").classList.contains("d-none")){
        map.locate();
        map.on("locationerror", function(e){
            onLocationError(e);
        });
        map.on("locationfound", function(e){
            let queryUrl;
            let weekAgo = new Date();
            pastDate = weekAgo.getDate() - 7;
            weekAgo.setDate(pastDate);
            let dateString = weekAgo.getFullYear() + "-" + (weekAgo.getMonth()+1) + "-" + weekAgo.getDate();
            queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime="+ dateString + "&latitude=" + e.latlng.lat +"&longitude=" + e.latlng.lng + "&maxradius=5&minmagnitude=6.5";
            apiInfo(queryUrl)
            .then(data => {
                for(feature of data.features){
                    L.popup({autoclose: false})
                        .setLatLng(max.geometry.coordinates.slice(0,2).reverse())
                        .setContent("<p><b>" + parseTime(max.properties.time) + "<br/>Magnitude: "+ max.properties.mag + "<br/>" + max.properties.place + "</b></p>")
                        .openOn(map);
                }
                setTimeout(function(){map.closePopup();}, 4000);
            })
            .catch(reason => console.log(reason.message));
        });
        return;
    }
    apiInfo(sigUrl)
    .then(data => {
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
}

//Gets user location and changes id="locate" button to active
//zooms/pans to user location on successful locate, else throws error alert
function zoomToUser() {
    var crosshair = document.getElementById("locate");
    if(crosshair.classList.contains("active")){
        document.getElementById("locateText").textContent= "Zoom to Your Location";
        crosshair.classList.remove("active");
        map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
        return;
    }
    map.locate();
    map.on("locationerror", function(e){
        alert(e.message);
    });
    map.on("locationfound", function(e){
        map.flyTo(e.latlng, 5);
        document.getElementById("locate").classList.add("active");
        document.getElementById("locateText").textContent= "Zoom to Earth View";
    });
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

//used to set marker color in map layer based on depth
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