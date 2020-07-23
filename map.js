const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

async function apiTest(url){
    let response = await fetch(url);
    if(response.status == 200){
        let data = await response.json();
        console.log(data);
        return data;
    }
    throw new Error(response.status);
};

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

function parseTime(epochDate) {
    var date = new Date(epochDate)
    return date.toGMTString()
}
var map = new L.Map("map", {
    center: new L.LatLng(38, -97),
    zoom: 2,
    worldCopyJump: true
});
var layer = new L.StamenTileLayer("toner");
map.addLayer(layer);

apiTest(url)
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag,
                    color: chooseColor(feature.properties.mag),
                    opacity: 0.3,
                }).bindPopup("<p><b>"+parseTime(feature.properties.time)+"</b><br/><b>Magnitude: "+feature.properties.mag+"</b></p>")
            },
            
        }).addTo(map);
    })
    .catch(reason => console.log(reason.message));