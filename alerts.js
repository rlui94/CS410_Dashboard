
apiInfo(url_day)
    .then(data => {
        for(feature of data.features){
            var parent = document.getElementById("activityPanel");
            var toadd = document.createElement("div");
            var details = document.createElement("div");
            toadd.classList.add("card");
            details.classList.add("card-body");
            details.innerHTML = "<b><u>Magnitude: " + feature.properties.mag.toFixed(2) +
                                "</u></b><br>" + feature.properties.place;//feature.properties.time;
            toadd.appendChild(details);
            parent.appendChild(toadd);
            
        }
    })
    .catch(reason => console.log(reason.message));