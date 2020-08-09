var stats = document.getElementById("quickStats");

//Adds content to id="quickStats" based on USGS api urls passed as args
function showStats(url = url_day, url_sig = url_day_sig){
    apiInfo(url)
    .then(data => {
        var total = document.getElementById("total");
        total.innerHTML = "<h2>Total Quakes</h2><p>"+data.features.length+"</p>";

        var largest = document.getElementById("largest");
        largest.innerHTML = "<h2>Largest Quake</h2><p>" + findMax(data.features).properties.mag.toFixed(1) +"</p>";
    })
    .catch(reason => console.log(reason.message));

    apiInfo(url_sig)
    .then(data => {
        var sig = document.getElementById("significant");
        sig.innerHTML = "<h2>Potential Damage</h2><p>" + data.features.length + "</p>";
    })
    .catch(reason => console.log(reason.message));

}

//Initialize id="quickStats"
showStats();
