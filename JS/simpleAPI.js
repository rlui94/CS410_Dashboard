//URLs for monthly, weekly, and daily earthquake geoJSON info
const url_month = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const url_month_sig = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
const url_week = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const url_week_sig = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
const url_day = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const url_day_sig = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson";
const url_hour = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

//API access function
async function apiInfo(url){
    let response = await fetch(url);
    if(response.status == 200){
        let data = await response.json();
        return data;
    }
    throw new Error(response.status);
}

//Find the maximum magnitude from API data
function findMax(features){
    var maxMag = 0;
    var max;
    for(feature of features){
        if(feature.properties.mag > maxMag) {
            maxMag = feature.properties.mag;
            max = feature;
        }
    }
    return max;
}

/*Usage Instructions
In your javascript code, call the function below using
url_month, url_week, or url_day (more can be added from USGS site):
    https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

apiInfo(url_{month | week | year})
    .then(data => {
        **YOUR CODE GOES HERE**
           console.log(data);     
        }
    })
    .catch(reason => console.log(reason.message));
*/