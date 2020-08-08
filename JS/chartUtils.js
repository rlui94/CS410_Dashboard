/*
URLs for monthly, weekly, and daily earthquake geoJSON info
const url_month = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const url_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url_day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const url_hour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
*/

// for testing
const url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-07-13T12:00:00&endtime=2020-07-13T18:00:00';
// for time
var timeFormat = 'MM/DD/YYY HH:mm';
var tooltipFormat = 'll HH:mm';

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
  try{
    var response = await fetch(url);
    var results = await response.json();
  } catch(err){
    console.log(err);
  }
  console.log('Results', results);
  document.getElementById('heading').innerHTML += `url: ${results.metadata.url}`;
  for (let i=0; i<results.features.length; i++){
      document.getElementById('results').innerHTML += `<li class="list-group-item"><p>Place: ${results.features[i.toString()].properties.place}</p>
          <p>Magnitude: ${results.features[i.toString()].properties.mag}</p></li>`
  }
}

/**
 * When a specific location needs to be queried. 
 * @param {int} minLat    default -90
 * @param {int} minLong   default -180
 * @param {int} maxLat    default 90
 * @param {int} maxLong   default 180
 * @param {int} startTime default one hour before current time
 * @param {int} endTime   default current time
 */
async function getViaLocTime(minLat=-90, minLong=-180, maxLat=90, maxLong=180, startTime=moment().subtract(1, 'hour'), endTime=moment()) {
    let url=`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=${minLat}&minlongitude=${minLong}&maxlatitude=${maxLat}&maxlongitude=${maxLong}&starttime=${startTime}&endtime=${endTime}`
    try{
      var response = await fetch(url);
      var results = await response.json();
    } catch(err){
      console.log(err);
    }
    console.log('Results', results);
    return results;
}

/**
 * Given a json object from USGS API and an html canvas node, 
 * create a donut chart of types of seismic activity in said node.
 * @param {json string} usgsObj   a json'd object from USGS API
 * @param {html element obj} chartNode html canvas node eg "<canvas id="typeChart" role="img"></canvas>"
 */
function makeDonutChart(usgsObj, chartNode){
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
    // make the chart and insert into node
    let chart = new Chart(chartNode,{
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
            aspectRatio: 1,
            legend: {
              position: 'bottom'
            },
          },
      })
}

/**
 * Given a json object from USGS API and an html canvas node, 
 * create a scatter chart of time vs quake magnitude.
 * @param {json string} usgsObj   a json'd object from USGS API
 * @param {html element obj} chartNode html canvas node eg "<canvas id="scatterChart" role="img"></canvas>"
 */
function makeScatterChart(usgsObj, chartNode, refresh = false, minTime = moment().subtract(1, 'hour'), maxTime = moment()){
  let results = []
  // place results into array of objects {x, y}
  for (let i=0; i<usgsObj.features.length; ++i){
    results.push({
      'x': usgsObj.features[i].properties.time,
      'y': usgsObj.features[i].properties.mag
    })
  }
  // make the chart and insert into node
  console.log(chartNode)
  Chart.defaults.global.defaultFontColor='#fff';
  var newChart = new Chart(chartNode,{
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Refresh Chart',
          data: results,
          pointBackgroundColor: 'rgba(255, 165, 0, 0.7)',
          pointBorderColor: 'orange',
          pointBorderWidth: 1,
          pointRadius: 6,
        }],
        labels: 'Scatter Dataset',
        },
        options:{
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                color: '#fff',
              },
              scaleLabel:{
                display: true,
                labelString: 'Time',
              },
              type: 'time',
              distribution: 'linear',
              time:{
                parser: timeFormat,
                tooltipFormat: tooltipFormat,
                displayFormats:{
                  hour: 'M/D hA',
                  week: 'MM D',
                },
                min: minTime,
                max: maxTime,
              },
              bounds: 'data',
            }],
            yAxes: [{
              gridLines: {
                display: true,
                color: '#fff',
              },
              scaleLabel:{
                display: true,
                labelString: 'Magnitude',
              },
              ticks: {
                min: 0,
              }
            }]
          },
          legend: {
            display: false,
          }
        },
    });
    if(refresh){
      refreshChart = newChart;
    }
}

/**
 * Updates the refreshing chart by calling API again and updating
 * the refreshChart object with new values based on current
 * refreshUrl value
 */
async function updateRefreshChart(){
  let timeMin = timeMax = moment();
  let timeFormat = 'M/D hA';
  switch(refreshUrl){
    case url_day : 
      timeMin = moment().subtract(1, 'day');
      break;
    case url_week: 
      timeMin = moment().subtract(1, 'week');
      timeFormat = 'M/D';
      break;
    default: 
      timeMin = moment().subtract(1, 'hour');
  }
  apiInfo(refreshUrl)
  .then(usgsObj => {
    let results = []
    // place results into array of objects {x, y}
    for (let i=0; i<usgsObj.features.length; ++i){
      results.push({
        'x': usgsObj.features[i].properties.time,
        'y': usgsObj.features[i].properties.mag
      })
    }
    refreshChart.data.datasets[0].data = results;
    refreshChart.options.scales.xAxes[0].time.min = timeMin;
    refreshChart.options.scales.xAxes[0].time.max = timeMax;
    refreshChart.options.scales.xAxes[0].time.displayFormats.hour = timeFormat;
    refreshChart.update();
  })
  .catch(reason => console.log(reason.message));
}

/**
 * Given a json object from USGS API and an html canvas node, 
 * create a bar chart of time vs number of quakes.
 * @param {json string} usgsObj   a json'd object from USGS API
 * @param {html element obj} chartNode html canvas node eg "<canvas id="scatterChart" role="img"></canvas>"
 */
function makeBarChart(usgsObj, chartNode){
  let results = {}, labels = null, vals = null;
    // count occurrences of each type
    for (let i=0; i<usgsObj.features.length; ++i){
        let type = moment(usgsObj.features[i].properties.time).format('MMM D');
        if(!results[type]){
            results[type] = 1;
        }
        else {
            results[type] = results[type] + 1;
        }
    }
    // get labels and values arrays chart requires
    labels = Object.getOwnPropertyNames(results).reverse();
    vals = Object.values(results).reverse();
  // make the chart and insert into node
  Chart.defaults.global.defaultFontColor='#fff';
  barChart = new Chart(chartNode,{
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Quakes',
          data: vals,
          backgroundColor: 'rgba(255, 165, 0, 0.7)',
          borderColor: 'orange',
          borderWidth: 2,
        }],
        },
        options:{
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                color: '#fff',
              },
              scaleLabel:{
                display: true,
                labelString: 'Date',
              },
              bounds: 'data',
            }],
            yAxes: [{
              gridLines: {
                display: true,
                color: '#fff',
              },
              scaleLabel:{
                display: true,
                labelString: '# of Quakes',
              },
              ticks: {
                min: 0,
              }
            }]
          },
          legend: {
            display: false,
          }
        },
    })
}

/**
 * Updates the bar chart by calling API again and updating
 * the barChart object with new values based on current
 * barUrl value
 */
async function updateBarChart(time){
  switch(time){
    case 'week': barUrl = url_week;
      break;
    default: barUrl = url_month;
  }
  apiInfo(barUrl)
  .then(usgsObj => {
    let results = {}, labels = null, vals = null;
    // count occurrences of each type
    for (let i=0; i<usgsObj.features.length; ++i){
        let type = moment(usgsObj.features[i].properties.time).format('MMM D');
        if(!results[type]){
            results[type] = 1;
        }
        else {
            results[type] = results[type] + 1;
        }
    }
    // get labels and values arrays chart requires
    labels = Object.getOwnPropertyNames(results).reverse();
    vals = Object.values(results).reverse();
    console.log(barChart);
    barChart.data.datasets[0].data = vals;
    barChart.data.labels = labels;
    barChart.update();
  })
  .catch(reason => console.log(reason.message));
}

/**
 * Set the current refreshUrl based on time period chosen
 * update refresh chart based on new refreshUrl
 * @param {string} time - time period to switch to
 */
function setThenRefresh(time){
  switch(time){
    case 'day' : refreshUrl = url_day;
      break;
    case 'week': refreshUrl = url_week;
      break;
    default: refreshUrl = url_hour;
  }
  updateRefreshChart();
}

/**
 * Make this grab form data in the future
 */
async function createTestChart(chartID){
    makeDonutChart(await getViaLocTime(), document.getElementById(chartID));
}

/**
 * Create a donut chart given a canvas element ID and the time period
 * with which to create the chart
 * @param {string} time 'day', 'week', or 'hour'
 * @param {string} chartID id of canvas element
 */
async function createSimpleDonut(time, chartID){
  switch(time){
    case 'day' : donutUrl = url_day;
      break;
    case 'week': donutUrl = url_week;
      break;
    default: donutUrl = url_hour;
  }
  apiInfo(donutUrl)
  .then(data => {
    makeDonutChart(data, document.getElementById(chartID));
  })
  .catch(reason => console.log(reason.message));
}

/**
 * Retrieve data from user input form, create a chart using said input.
 * Ensure that within the form there is an element named 'error-output' for validation
 * @param {string} formID  id of form to grab data from
 * @param {string} chartID id of chart to draw chart into
 */
async function createTypeChartViaForm(formID, chartID){
  let form = document.getElementById(formID);
  let err = document.getElementById('error-output');
  let start = form.elements['startTime'].valueAsNumber;
  let end = form.elements['endTime'].valueAsNumber;
  if(isNaN(start)){
    err.innerHTML = `Please enter a valid start time.`
  }
  else if(isNaN(end)){
    err.innerHTML = `Please enter a valid end time.`
  }
  else if(start >= end){
    err.innerHTML = `Start time cannot be later than end time.`
  }
  else{
    err.innerHTML = ``;
    start = moment(start);
    end = moment(end);
    makeDonutChart(await getViaLocTime(form.elements['minLat'].value, form.elements['minLong'].value,
    form.elements['maxLat'].value, form.elements['maxLong'].value, start, end), document.getElementById(chartID));
    document.getElementById(chartID).style="display:inline";
  }
  
}

/**
 * Create initial refreshing chart object
 * @param {string} chartID ID of chart node
 */
async function createRefreshChart(chartID, infoID = null){
  apiInfo(refreshUrl)
  .then(data => {
    apiData = data;
    makeScatterChart(data, chartID, true);
    if(infoID){
      setClickHandler(chartID, infoID);
    }
  })
  .catch(reason => console.log(reason.message));
}

/**
 * Create initial bar chart
 * @param {html element obj} chartNode html canvas node eg "<canvas id="scatterChart" role="img"></canvas>"
 */
async function createQuakesChart(chartNode){
  apiInfo(barUrl)
  .then(data=>{
    makeBarChart(data, chartNode);
  })
  .catch(reason => console.log(reason.message));
}

/**
 * Create an event handler for getting information when clicking points on scatter plot
 * @param {string} chartID chart ID 
 */
function setClickHandler(chartID, infoID){
  document.getElementById(chartID).onclick = function(e){
    var points = refreshChart.getElementAtEvent(e)[0];
    if(points){
      let time = refreshChart.data.datasets[points._datasetIndex].data[points._index].x;
      for(let i=0; i<apiData.features.length; i++){
        if(apiData.features[i].properties.time == time){
          console.log(apiData.features[i].properties);
          let info = apiData.features[i].properties;
          let infoNode = document.getElementById(infoID);
          infoNode.innerHTML = `
            <h2>Info Panel</h2>
            <p><u>${info.title}</u></p>
            <p>${info.type[0].toUpperCase() + info.type.slice(1)}</p>
            <p>${moment(info.time)}</p>
          `;
        }
      }
    }
  }
}

// some utilities for hiding and showing elements
function hideElem(elemID){
  document.getElementById(elemID).style.display = 'none';
}

function displayElem(elemID){
  document.getElementById(elemID).style.display = 'inline';
}

function toggleElemDisplay(elemID){
  var node = document.getElementById(elemID);
  if(node.style.display == 'none'){
      node.style.display = 'inline'
  } else{
      node.style.display = 'none';
  }
}

function hideClass(className){
  obj = document.getElementsByClassName(className);
  for(i=0; i<obj.length; i++){
    obj[i].style = 'display: none';
  }
}

function displayClass(className){
  obj = document.getElementsByClassName(className);
  for(i=0; i<obj.length; i++){
    obj[i].style = 'display: inline';
  }
}