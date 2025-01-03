import {centerCoordinates} from "./constant.js"


const nbCol = 10;
const nbLine = 6;
const resolution_case = 2000


// Largeur en degre de chaque case de la grille
// var gridSize = Math.min((villeurbanneCoordinates[0] - lyonCoordinates[0]) / 10, (villeurbanneCoordinates[1] - lyonCoordinates[1]) / 6);
// précision en mettre  / circumférence terre * 360 degre
const gridSize = resolution_case / 40075000 * 360

export function getBounds(sensor) {
    let sw = { "long": sensor.sw.long, "lat": sensor.sw.lat }
    let se = { "long": sensor.ne.long, "lat": sensor.sw.lat }
    let nw = { "long": sensor.sw.long, "lat": sensor.ne.lat }
    let ne = { "long": sensor.ne.long, "lat": sensor.ne.lat }

    return { sw, ne, se, nw };
}

export function getGlobalBounds(sensors) {
    if (sensors.length === 0) {
        return null; // Si la liste est vide, retourne null
    }

    var lastSensor = sensors.find((sensor) => sensor.id == nbCol*nbLine)
    var firstSensor = sensors.find((sensor) => sensor.id == 1)

    let sw = { "long": firstSensor.sw.long, "lat": lastSensor.sw.lat }
    let ne = { "long": lastSensor.ne.long, "lat": firstSensor.ne.lat }
    let se = { "long": lastSensor.ne.long, "lat": lastSensor.sw.lat }
    let nw = { "long": firstSensor.sw.long, "lat": firstSensor.ne.lat }

    return { sw, ne, se, nw };
}

var sensors = []
function generateSensors() {
    for (var i = -nbLine / 2; i < nbLine / 2; i++) {
        for (var j = -nbCol / 2; j < nbCol / 2; j++) {
            // ajuster les coordonnées calculées pour gérer la superposition de moitier
            // var ajustJ = (gridSize/2)*(j+nbCol/2) - (gridSize*(nbCol/4+0.25))
            // var ajustJ = gridSize*(0.5*j-0.25)
            if (i % 2 == 0) {
                var adjustJ = gridSize / 2
            } else {
                var adjustJ = 0
            }
            // var ajustI = (gridSize/2)*(i+nbLine/2) - (gridSize*(nbLine/4+0.25))
            var adjustI = gridSize * (0.5 * i - 0.25)
            // var ajustI = 0

            var grid_coordinates = [
                [(centerCoordinates[0] - gridSize / 2) + j * gridSize - adjustJ, (centerCoordinates[1] - gridSize / 2) + i * gridSize - adjustI],
                [(centerCoordinates[0] - gridSize / 2) + (j + 1) * gridSize - adjustJ, (centerCoordinates[1] - gridSize / 2) + i * gridSize - adjustI],
                [(centerCoordinates[0] - gridSize / 2) + (j + 1) * gridSize - adjustJ, (centerCoordinates[1] - gridSize / 2) + (i + 1) * gridSize - adjustI],
                [(centerCoordinates[0] - gridSize / 2) + j * gridSize - adjustJ, (centerCoordinates[1] - gridSize / 2) + (i + 1) * gridSize - adjustI],
                [(centerCoordinates[0] - gridSize / 2) + j * gridSize - adjustJ, (centerCoordinates[1] - gridSize / 2) + i * gridSize - adjustI]
            ]

            // calcul centre case
            var centerLng = (centerCoordinates[0] - gridSize / 2) + j * gridSize - adjustJ + gridSize / 2;
            var centerLat = (centerCoordinates[1] - gridSize / 2) + i * gridSize - adjustI + gridSize / 2;

            // pour trouver l'id lié à la coordonné inversé de la génération
            var id = ((-i + nbLine * 1.5 + 1) % (nbLine + 1) - 1) * nbCol + (j + nbCol * 1.5 + 1) % (nbCol + 1) + 1
            sensors.push(
                {
                    'id': id,
                    'sw': {
                        'long': grid_coordinates[0][0],
                        'lat': grid_coordinates[0][1]
                    }, 
                    'ne': {
                        'long': grid_coordinates[2][0],
                        'lat': grid_coordinates[2][1]
                    },
                    'center': {
                        'long': centerLng,
                        'lat': centerLat
                    }
                }
            )
        }
    }
}

export function getSensors() {
    return sensors
}

export function sensorsMain() {
    generateSensors()
}