// Déclaration
mapboxgl.accessToken = 'pk.eyJ1Ijoic2thZmVlIiwiYSI6ImNscHNkajkxYzAyb3MyanQ3OTR6ZWl5bnkifQ.a_IZDhqmRKB_KJ6w6A24iA';


import { mapMain } from "./maps.js";
// import { debugMain } from "./debug.js";
// import { CaserneMain } from "./caserne.js";



//=========== Template ===========
function init() {
    // Charger le contenu du header.html
    fetch("/views/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        });


}
document.addEventListener("DOMContentLoaded", init());

// ========== Maps ==========
var map = mapMain(map)
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: centerCoordinates,
//     zoom: 11.2
// });
// debugMain(map)
// CaserneMain(map)
// CaserneMain(map)