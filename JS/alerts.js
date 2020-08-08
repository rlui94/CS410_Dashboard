//All seismic activity for the past hour
//Magnitude, location, time,
if(document.getElementById("activityPanel")){
    apiInfo(url_day)
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
apiInfo(url_day)
    .then(data => {
        var previous = document.querySelector(".dropdown");
        for(feature of data.features){
            var newAlert = document.createElement("div");
            var dismiss = document.createElement("button");
            newAlert.classList.add("col-12","col-sm-7","col-md-8","col-lg-9","col-xl-10","alert", "alert-danger", "alert-dismissible", "fade", "show");
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
    