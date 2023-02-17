const ipifyURL = 'https://geo.ipify.org/api/v2/country,city'
const ipifyKey = 'at_SLmtfxVEgxOGopwDzOfi2dvHvsU4P'
const geo_url = 'https://geo.ipify.org/api/v2/country,city?apiKey=&ipAddress='

const ipInput = document.getElementById('ipInput');
const addressField = document.getElementById('address').getElementsByClassName('info')[0];
const locationField = document.getElementById('location').getElementsByClassName('info')[0];
const timezoneField = document.getElementById('timezone').getElementsByClassName('info')[0];
const ispField = document.getElementById('isp').getElementsByClassName('info')[0];

const states = {
    'Alabama' : 'AL',
    'Alaska' : 'AK',
    'American Samoa' : 'AS',
    'Arizona' : 'AZ',
    'Arkansas' : 'AR',
    'Armed Forces Americas' : 'AA',
    'Armed Forces Europe' : 'AE',
    'Armed Forces Pacific' : 'AP',
    'California' : 'CA',
    'Colorado' : 'CO',
    'Connecticut' : 'CT',
    'Delaware' : 'DE',
    'District Of Columbia' : 'DC',
    'Florida' : 'FL',
    'Georgia' : 'GA',
    'Guam' : 'GU',
    'Hawaii' : 'HI',
    'Idaho' : 'ID',
    'Illinois' : 'IL',
    'Indiana' : 'IN',
    'Iowa' : 'IA',
    'Kansas' : 'KS',
    'Kentucky' : 'KY',
    'Louisiana' : 'LA',
    'Maine' : 'ME',
    'Marshall Islands' : 'MH',
    'Maryland' : 'MD',
    'Massachusetts' : 'MA',
    'Michigan' : 'MI',
    'Minnesota' : 'MN',
    'Mississippi' : 'MS',
    'Missouri' : 'MO',
    'Montana' : 'MT',
    'Nebraska' : 'NE',
    'Nevada' : 'NV',
    'New Hampshire' : 'NH',
    'New Jersey' : 'NJ',
    'New Mexico' : 'NM',
    'New York' : 'NY',
    'North Carolina' : 'NC',
    'North Dakota' : 'ND',
    'Northern Mariana Islands' : 'NP',
    'Ohio' : 'OH',
    'Oklahoma' : 'OK',
    'Oregon' : 'OR',
    'Pennsylvania' : 'PA',
    'Puerto Rico' : 'PR',
    'Rhode Island' : 'RI',
    'South Carolina' : 'SC',
    'South Dakota' : 'SD',
    'Tennessee' : 'TN',
    'Texas' : 'TX',
    'US Virgin Islands' : 'VI',
    'Utah' : 'UT',
    'Vermont' : 'VT',
    'Virginia' : 'VA',
    'Washington' : 'WA',
    'West Virginia' : 'WV',
    'Wisconsin' : 'WI',
    'Wyoming' : 'WY'
}

var map = L.map('map', {
    zoomControl: false
});
var customMarker = L.icon({
    iconUrl: './img/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 55]
});
var locationMarker = L.marker([0, 0], {icon: customMarker}).addTo(map);
L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=pa0TTxuqmZIvMvSESESA', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);

function setRegion(region) {
    if (region in states) {
        return states[region]
    }
    return region
}

async function getGeoData(ipAddress=null, domain=null) {
    let requestURL = new URL(ipifyURL);

    requestURL.searchParams.append('apiKey', ipifyKey);
    if (domain) {
        requestURL.searchParams.append('domain', domain);
    }
    else if (ipAddress) {
        requestURL.searchParams.append('ipAddress', ipAddress);
    }
    
    const response = await fetch(requestURL);
    const geoData = await response.json();

    addressField.innerText = geoData.ip
    locationField.innerText = `${geoData.location.city}, ${setRegion(geoData.location.region)} ${geoData.location.postalCode}`
    timezoneField.innerText = `UTC ${geoData.location.timezone}`
    ispField.innerText = geoData.isp
    
    map.setView(
        [geoData.location.lat, geoData.location.lng],
        15
    );
    locationMarker.setLatLng([geoData.location.lat, geoData.location.lng]);
}

function searchIP() {
    const addressRE = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
   
    if (addressRE.test(ipInput.value))
        getGeoData(ipInput.value);
    else
        getGeoData(null, ipInput.value);
}

async function loadUserIP() {
    const response = await fetch(ipify);
    const data = await response.json();

    return data.ip;
}

getGeoData();