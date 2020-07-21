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

/**
 * When a specific location needs to be queried. 
 * @param {*} minLat    default -90
 * @param {*} minLong   default -180
 * @param {*} maxLat    default 90
 * @param {*} maxLong   default 180
 * @param {*} startTime default 2020-07-13T12:00:00
 * @param {*} endTime   default 2020-07-13T18:00:00
 */
async function getViaLoc(minLat=-90, minLong=-180, maxLat=90, maxLong=180, startTime='2020-07-13T12:00:00', endTime='2020-07-13T18:00:00') {
    let url=`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLat}&minlongitude=${minLong}&maxlatitude=${maxLat}&maxlongitude=${maxLong}&starttime=${startTime}&endtime=${endTime}`
    let response = await fetch(url);
    let results = await response.json();
    console.log('Results', results);
    return results;
}

function displayChart(usgsObj, chartNode){
    let results = {}, labels = [], vals = [];
    // count occurrences of each type
    for (let i=0; i<usgsObj.features.length; ++i){
        let type = usgsObj.features[i].properties.type;
        if(!results[type]){
            results[type] = 1;
        }
        else {
            results[type] = results[type] + 1;
        }
    }
    // get labels and values arrays chart requires
    labels = Object.getOwnPropertyNames(results);
    vals = Object.values(results);
    let doughnut = new Chart(chartNode,{
        type: 'doughnut',
        data: {
          datasets: [{
            data: vals,
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(255, 99, 132, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(199, 199, 199, 0.8)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(159, 159, 159, 1)',
            ]
          }],
          labels: labels,
          },
          options:{
            legend: {
              position: 'bottom'
            },
          },
      })
}

/**
 * Make this grab form data in the future
 */
async function invokeChart(){
    displayChart(await getViaLoc(), document.getElementById('typeChart'));
}