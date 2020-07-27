//URLs for monthly, weekly, and daily earthquake geoJSON info
const url_month = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const url_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url_day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//API access function
async function apiInfo(url){
    let response = await fetch(url);
    if(response.status == 200){
        let data = await response.json();
        return data;
    }
    throw new Error(response.status);
}