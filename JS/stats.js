

var stats = document.getElementById("quickStats");
apiInfo(url_day)
    .then(data => {
        var total = document.getElementById("total");
        total.innerHTML = "<p>Total Quakes</p><h2>"+data.features.length+"</h2>";

        var largest = document.getElementById("largest");
        largest.innerHTML = "<p>Largest Quake</p><h2>" + findMax(data.features).mag +"</h2>";
    })
    .catch(reason => console.log(reason.message));

apiInfo(url_day_sig)
    .then(data => {
        var sig = document.getElementById("significant");
        sig.innerHTML = "<p>Caused Damage</p><h2>" + data.features.length + "</h2>";
    })
    .catch(reason => console.log(reason.message));
