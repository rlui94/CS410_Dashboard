// for modifying refresh chart
var refreshChart = null;
var refreshUrl = url_hour;
var interval = 60000;
// for modifying bar chart
var barChart = null;
var barUrl = url_week;
// for plot chart
var plotChart = null;
var apiData = null;

function formToggle(str){
    switch(str){
        case 'type': 
            displayClass('type-form');
            hideClass('plot-form');
            break;
        case 'plot':
            hideClass('type-form');
            displayClass('plot-form');
            break;
        default:
    }
}

/**
 * Create a scatter plot using information from a user input form
 * @param {string} formID form element ID
 * @param {string} chartID chart element ID
 * @param {string} infoID info panel element ID
 */
async function createPlot(formID, chartID, infoID){
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
        getViaLocTime(form.elements['minLat'].value, form.elements['minLong'].value,
        form.elements['maxLat'].value, form.elements['maxLong'].value, start, end)
        .then(data => {
            apiData = data;
            plotChart = makeScatterChart(data, chartID, start, end);
            setClickHandler(chartID, infoID, plotChart);
            document.getElementById(infoID).style="display:block";
        })
        .catch(reason => console.log(reason.message));
    }
}

window.onload = createRefreshChart('refresh-chart');
let refresh = window.setInterval(function(){updateRefreshChart()}, interval);
window.onload = createQuakesChart('bar-chart');