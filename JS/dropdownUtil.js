//Changes map and stats based on id="dropdownButton" selection
//changes menu options and button display to reflect selection
//calls showStats() and displayDay()
function changeToDay() {
    if(document.getElementById("locate").classList.contains("active")){
        document.getElementById("locateText").textContent= "Zoom to Your Location";
        document.getElementById("locate").classList.remove("active");
        map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
    }
    document.getElementById("dropdownTitle").textContent = "Activity Today";
    document.getElementById("showDay").classList.add("d-none");
    document.getElementById("showMonth").classList.remove("d-none");
    document.getElementById("showWeek").classList.remove("d-none");
    showStats(url_day, url_day_sig);
    displayDay();

}

//Changes map and stats based on id="dropdownButton" selection
//changes menu options and button display to reflect selection
//calls showStats() and displayDay()
function changeToWeek() {
    if(document.getElementById("locate").classList.contains("active")){
        document.getElementById("locateText").textContent= "Zoom to Your Location";
        document.getElementById("locate").classList.remove("active");
        map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
    }
    document.getElementById("dropdownTitle").textContent = "Activity Past Week";
    document.getElementById("showWeek").classList.add("d-none");
    document.getElementById("showMonth").classList.remove("d-none");
    document.getElementById("showDay").classList.remove("d-none");
    document.getElementById("showMe").classList.remove("d-none");
    showStats(url_week, url_week_sig);
    displayWeek();

}

//Changes map and stats based on id="dropdownButton" selection
//changes menu options and button display to reflect selection
//calls showStats() and displayMonth()
function changeToMonth() {
    if(document.getElementById("locate").classList.contains("active")){
        document.getElementById("locateText").textContent= "Zoom to Your Location";
        document.getElementById("locate").classList.remove("active");
        map.flyToBounds([[70,-160],[-70, 160]]).invalidateSize();
    }
    document.getElementById("dropdownTitle").textContent = "Activity Past Month";
    document.getElementById("showMonth").classList.add("d-none");
    document.getElementById("showWeek").classList.remove("d-none");
    document.getElementById("showDay").classList.remove("d-none");
    document.getElementById("showMe").classList.remove("d-none");
    showStats(url_month, url_month_sig);
    displayMonth();

}

//Changes map and stats based on id="dropdownButton" selection
//changes menu options and button display to reflect selection
//creates USGS api query based on user location
//calls showStats() and displayWeek()
function changeToMe() {
    map.locate();
    map.on("locationerror", onLocationError);
    map.on("locationfound", function(e){
        displayWeek();
        let weekAgo = new Date();
        pastDate = weekAgo.getDate() - 7;
        weekAgo.setDate(pastDate);
        let dateString = weekAgo.getFullYear() + "-" + (weekAgo.getMonth()+1) + "-" + weekAgo.getDate();
        let queryURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime="+ dateString + "&latitude=" + e.latlng.lat +"&longitude=" + e.latlng.lng + "&maxradius=5";
        onLocationFound(e);
        document.getElementById("dropdownTitle").textContent = "Recent Near Me";
        document.getElementById("showMe").classList.add("d-none");
        document.getElementById("showMonth").classList.remove("d-none");
        document.getElementById("showWeek").classList.remove("d-none");
        document.getElementById("showDay").classList.remove("d-none");
        let sigURL = queryURL + "&minmagnitude=6.5";
        showStats(queryURL, sigURL);
    });
}
