const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-07-13T12:00:00&endtime=2020-07-13T18:00:00';

/**
 * Hits the url endpoint listed above and prints the resulting features as a list to DOM with 
 * Place and Magnitude properties. Sometimes takes a minute to get results.
 * 
 * Results formatted like so:
 * bbox: (6) [-155.50132751465, -24.8076, 0, 128.1591, 60.2585, 146.95]
 * features: (63) [{
 *      geometry: {type: "Point", coordinates: Array(3)}
 *      id: "nc73425746"
 *      properties: {mag: 0.76, place: "3km NE of Mammoth Lakes, CA", time: 1594663196730, updated: 1594665242473, tz: null, …}
 *      type: "Feature"
 * }]
 * metadata: {generated: 1594666170000, url: "https://earthquake.usgs.gov/fdsnws/event/1/query?f…e=2020-07-13T12:00:00&endtime=2020-07-13T18:00:00", title: "USGS Earthquakes", status: 200, api: "1.10.3", …}
 * type: "FeatureCollection"
 */
async function invokeAPI(){
    let response = await fetch(url);
    let results = await response.json();
    console.log('Results', results);
    document.getElementById('heading').innerHTML += `url: ${results.metadata.url}`;
    for (let i=0; i<results.features.length; i++){
        document.getElementById('results').innerHTML += `<li class="list-group-item"><p>Place: ${results.features[i.toString()].properties.place}</p>
            <p>Magnitude: ${results.features[i.toString()].properties.mag}</p></li>`
    }
}
