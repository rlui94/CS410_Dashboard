function changeToDay() {
    document.getElementById("dropdownTitle").textContent = "Activity Today";
    document.getElementById("showDay").classList.add("d-none");
    document.getElementById("showMonth").classList.remove("d-none");
    document.getElementById("showWeek").classList.remove("d-none");
    showStats(url_day, url_day_sig);
    displayDay();

}

function changeToWeek() {
    document.getElementById("dropdownTitle").textContent = "Activity Past Week";
    document.getElementById("showWeek").classList.add("d-none");
    document.getElementById("showMonth").classList.remove("d-none");
    document.getElementById("showDay").classList.remove("d-none");
    showStats(url_week, url_week_sig);
    displayWeek();

}

function changeToMonth() {
    document.getElementById("dropdownTitle").textContent = "Activity Past Month";
    document.getElementById("showMonth").classList.add("d-none");
    document.getElementById("showWeek").classList.remove("d-none");
    document.getElementById("showDay").classList.remove("d-none");
    showStats(url_month, url_month_sig);
    displayMonth();

}