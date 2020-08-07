// for modifying refresh chart
var refreshChart = null;
var refreshUrl = url_hour;
var interval = 60000;
// for modifying bar chart
var barChart = null;
var barUrl = url_week;

function formToggle(str){
    switch(str){
        case 'type': 
            displayElem('type-form-container')
            break;
        case 'list':
            hideElem('type-form-container');
            break;
        default:
    }
}

window.onload = createRefreshChart('refresh-chart');
let refresh = window.setInterval(function(){updateRefreshChart()}, interval);
window.onload = createQuakesChart('bar-chart');