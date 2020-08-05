// for modifying refresh chart
var refreshChart = null;
var refreshUrl = url_hour;
var interval = 60000;

window.onload = createRefreshChart('refresh-chart');
let refresh = window.setInterval(function(){updateRefreshChart()}, interval);