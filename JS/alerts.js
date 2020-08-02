
if(document.getElementById("activityPanel")){
    apiInfo(url_hour)
        .then(data => {
            for(feature of data.features){
                var parent = document.getElementById("activityPanel");
                var toadd = document.createElement("div");
                var details = document.createElement("div");
                //var tsunami = document.getElementById("tsunami");

                toadd.classList.add("card");
                details.classList.add("card-body");
                details.innerHTML = "<b><u>Magnitude: " + feature.properties.mag.toFixed(2) +
                                    "</u></b><br>" + feature.properties.place + "<br>" + parseTime(feature.properties.time);
                switch (feature.properties.alert){
                    case "yellow":
                        toadd.classList.add("bg-warning");
                        break;
                    case "orange":
                        toadd.classList.add("bg-warning");
                        break;
                    case "red":
                        toadd.classList.add("bg-warning");
                        break;
                    default:
                        toadd.classList.add("bg-dark");
                        break;
                }

                toadd.appendChild(details);
                parent.appendChild(toadd);
            }
        })
        .catch(reason => console.log(reason.message));
}

apiInfo(url_day)
    .then(data => {
        var previous = document.querySelector("header");
        for(feature of data.features){
            var newAlert = document.createElement("div");
            newAlert.classList.add("alert", "alert-danger", "alert-dismissible", "fade", "show");
            newAlert.setAttribute("role", "alert");
            var dismiss = document.createElement("button");
            if(feature.properties.tsunami == 1) {
                console.log(feature.properties.title);
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
    