//All seismic activity for the past hour
//If activityPanel is included on page, cards are populated with
//activity details for the past hour
//calls USGS api
if(document.getElementById("activityPanel")){
    apiInfo(url_hour)
        .then(data => {
            for(feature of data.features){
                var parent = document.getElementById("activityPanel");
                var toadd = document.createElement("div");
                var details = document.createElement("div");

                toadd.classList.add("card");
                details.classList.add("card-body");
                details.innerHTML = "<b>Magnitude: " + feature.properties.mag.toFixed(2) +
                                    "</b><br>" + feature.properties.place + "<br>" + parseTime(feature.properties.time);
                //Intentional fall through of cases
                switch (feature.properties.alert){
                    case "yellow":
                    case "orange":
                    case "red":
                        var aWarning = document.createElement("p");
                        aWarning.textContent = "SEVERE QUAKE";
                        aWarning.classList.add("text-warning");
                        toadd.classList.add("border", "border-warning");
                        toadd.appendChild(aWarning);
                        break;
                    default:
                        //toadd.classList.add("bg-dark");
                        break;
                }
                if(feature.properties.tsunami == 1){
                    var tWarning = document.createElement("p");
                    tWarning.textContent = "TSUNAMI WARNING";
                    tWarning.classList.add("text-warning")
                    toadd.classList.add("border","border-warning");
                    toadd.appendChild(tWarning);
                    
                }
                toadd.appendChild(details);
                parent.appendChild(toadd);
            }
        })
        .catch(reason => console.log(reason.message));
}

//Pop-up Tsunami warning at under nav bar
//calls USGS api
apiInfo(url_hour)
    .then(data => {
        var previous = document.querySelector("header");
        for(feature of data.features){
            var newAlert = document.createElement("div");
            var dismiss = document.createElement("button");
            newAlert.classList.add("alert", "alert-danger", "alert-dismissible", "fade", "show");
            newAlert.setAttribute("role", "alert");
            if(feature.properties.tsunami == 1) {
                newAlert.innerHTML = "<strong>TSUNAMI WARNING</strong><p>"+feature.properties.title +"<br/>"+ parseTime(feature.properties.time)+"</p><a href='"+feature.properties.url+"'>More Info</a>";
                dismiss.setAttribute("type", "button");
                dismiss.classList.add("close");
                dismiss.setAttribute("data-dismiss", "alert");
                dismiss.setAttribute("aria-label", "Close");
                dismiss.innerHTML = "<span aria-hidden='true'>&times;</span>";
                newAlert.appendChild(dismiss);
                previous.after(newAlert);
            }
        }
    })
    .catch(reason => console.log(reason.message));
    