const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

async function apiTest(){
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
            return "green";
        case value < 6:
            return "yellow";
        case value < 8:
            return "orange";
        case value >= 8:
            return "red";
        default:
            console.log(value);
            return "blue";
    }
}
var map = new L.Map("map", {
    center: new L.LatLng(38, -97),
    zoom: 2.5,
    worldCopyJump: true
});
var layer = new L.StamenTileLayer("toner");
map.addLayer(layer);


apiTest()
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, {
                    title: "test",
                    radius: feature.properties.mag,
                    color: chooseColor(feature.properties.mag),
                    opacity: 0.3
                });
            },
        }).addTo(map);
    })
    .catch(reason => console.log(reason.message));