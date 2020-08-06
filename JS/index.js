// api data for reuse
var apiData = null;
// for modifying refresh chart
var refreshChart = null;
var refreshUrl = url_hour;
var interval = 60000;
// for modifying bar chart
var barChart = null;
var barUrl = url_week;
// for modifying donut chart
var donutChart = null;
var donutUrl = url_day;

// create refresh chart
window.onload = createRefreshChart('refresh-chart', 'info-panel');
let refresh = window.setInterval(function(){updateRefreshChart()}, interval);
// create bar chart
window.onload = createQuakesChart('bar-chart');
// create donut chart
window.onload = createSimpleDonut('day', 'type-chart');
