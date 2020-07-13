const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-07-13T12:00:00&endtime=2020-07-13T18:00:00';

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
