

var stats = document.getElementById("quickStats");
apiInfo(url_day)
    .then(data => {
        var total = document.getElementById("total");
        total.innerHTML = "<h5>Number of Quakes</h5><br><h1>"+data.features.length+"</h1>";
        stats.appendChild(total);

        var largest = document.getElementById("largest");
        largest.innerHTML = "<h5>Largest Magnitude</h5><br><h1>" + findMax(data.features).mag +"</h1><h6><i>click tile to view location</i></h6>";
        stats.appendChild(largest);
    })
    .catch(reason => console.log(reason.message));

apiInfo(url_day_sig)
    .then(data => {
        var sig = document.getElementById("significant");
        sig.innerHTML = "<h5>Significant Quakes</h5><br><h1>" + data.features.length + "</h1><h6><i>click tile to view locations on map</i></h6>";
        stats.appendChild(sig);

    })
    .catch(reason => console.log(reason.message));
