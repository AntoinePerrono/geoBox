import { mapMain } from "./maps.js";
import { sensorsMain } from "./sensor.js";
// import { debugMain } from "./debug.js";


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
sensorsMain()
var map = mapMain(map)
// debugMain(map)

// CaserneMain(map)
// CaserneMain(map)