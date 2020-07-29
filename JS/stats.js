function findMax(features){
    var max = 0;
    for(feature of features){
        if(feature.properties.mag > max) {
            max = feature.properties.mag;
        }
    }
    return max;
}

var stats = document.getElementById("quickStats");
apiInfo(url_day)
    .then(data => {
        var total = document.createElement("div");
        total.classList.add("card");
        total.innerHTML = "<h5>Number of Quakes</h5><br><h1>"+data.features.length+"</h1>";
        stats.appendChild(total);

        var largest = document.createElement("div");
        largest.classList.add("card");
        largest.innerHTML = "<h5>Largest Magnitude</h5><br><h1>" + findMax(data.features) +"</h1>";
        stats.appendChild(largest);
    })
    .catch(reason => console.log(reason.message));

apiInfo(url_day_sig)
    .then(data => {
        var sig = document.createElement("div");
        sig.classList.add("card");
        sig.innerHTML = "<h5>Significant Quakes</h5><br><h1>" + data.features.length + "</h1>";
        stats.appendChild(sig);

    })