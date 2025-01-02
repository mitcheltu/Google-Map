
function getGridNums(lng, lat) {
let request = new XMLHttpRequest();
let url = 'https://api.weather.gov/points/' + lat + ',' + lng;
console.log(url);
request.open('GET', url, false, 'tumk@uci.edu');
var gridId, gridX, gridY = 0
request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
    const data = JSON.parse(request.responseText);
    gridId = data['properties']['gridId'];
    gridX = data['properties']['gridX'];
    gridY = data['properties']['gridY'];
    }
};
request.send();
return [gridId, gridX, gridY]
}



function getForecast(gridInfo) {
    let request = new XMLHttpRequest();
    let url = 'https://api.weather.gov/gridpoints/' + gridInfo[0] + '/' + gridInfo[1] + ',' + gridInfo[2] + '/forecast';
    console.log(url);
    request.open('GET', url, false, 'tumk@uci.edu');
    var polygon = 0
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
        const data = JSON.parse(request.responseText);
        polygon =  data['geometry']['coordinates'][0];
        tableCreate(data);
        }
    };
    request.send();
    return polygon
    }

function convertPolygon(polygon){
    var newCoords = [];
    for(let i=0; i < polygon.length; i++){
        newCoords.push({lat: polygon[i][1], lng: polygon[i][0]})
    }
    return newCoords
}

function getAddress(lng,lat) {
    let request = new XMLHttpRequest();
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyDpVQLgCFstJJYapfn9ftoazoEGPMA9ehY';
    console.log(url);
    request.open('GET', url, false, 'tumk@uci.edu');
    var polygon = 0
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
        const data = JSON.parse(request.responseText);
        address =  data['results'][0]['formatted_address'];
        document.getElementById('address').textContent = address;
        }
    };
    request.send();
}

function tableCreate(data) {
    const table = document.getElementById('table')
    table.innerHTML = "";
    const tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.style.border = '3px solid #b3af8f';
    //date time temp(F) rain windspeed detailedForecast
    columnIndex = ['Date','Time','Temp','Rain','Wind','Desc']
    
    

    for(i=0; i<6; i++){
        const tr = tbl.insertRow();
        for(j=0; j<8; j++){
            const td = tr.insertCell();
            let fill = '';
            period = data['properties']['periods'][j];
            if (j==0){
                fill = columnIndex[i];
            }
            else if (i==0){
                fill = period['name'];
                td.style.border = '4px solid #0d1b2a';
                td.style.fontWeight = 900;
                td.style.textAlign = 'center';
            }
            else {
                if (i==1){
                    fill+= period['startTime'].substring(11,16) + '-' + period['endTime'].substring(11,16);
                }
                else if (i==2){
                    fill = period['temperature'] + ' ' + period['temperatureUnit'];
                }
                else if (i==3){
                    if (period['probabilityOfPrecipitation']['value']==null){
                        fill = 'NA';
                    }
                    else{
                        fill = period['probabilityOfPrecipitation']['value'] + '%';
                    }
                }
                else if (i==4){
                    fill = period['windSpeed'];
                }
                else if (i==5){
                    fill = period['detailedForecast']
                }
                td.style.border = '3px solid #b3af8f';
                td.style.borderSpacing = '0px';
            }
            td.style.padding = '5px';
            td.appendChild(document.createTextNode(fill));
            
        }
    }
    table.appendChild(tbl);
}

function search(ele) {
    let request = new XMLHttpRequest();
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(ele.value)+'&key=AIzaSyDpVQLgCFstJJYapfn9ftoazoEGPMA9ehY';
    console.log(url);
    request.open('GET', url, false, 'tumk@uci.edu');
    var lng,lat = 0;
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
        const data = JSON.parse(request.responseText);
        lng = data['results'][0]['geometry']['location']['lng'];
        lat = data['results'][0]['geometry']['location']['lat'];
        }
    };
    request.send();
    return [lng,lat];
}