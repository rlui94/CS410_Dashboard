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

window.onload = createRefreshChart('refresh-chart');
let refresh = window.setInterval(function(){updateRefreshChart()}, interval);
window.onload = createQuakesChart('bar-chart');
window.onload = createSimpleDonut('day', 'type-chart');