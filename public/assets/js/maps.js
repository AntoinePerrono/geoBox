import { getGlobalBounds, getSensors, getBounds } from "./sensor.js";
import {centerCoordinates} from "./constant.js"
import { APIKey } from "./secret.js";

mapboxgl.accessToken = APIKey;

function findCenter(point1, point2) {
    var newCoords = []
    newCoords[0] = (point1.long + point2.long) / 2
    newCoords[1] = (point1.lat + point2.lat) / 2

    return newCoords
}


function getGlobalBoundsGEO(globalBounds) {
    const globalBoundsGEO = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [globalBounds.nw.long, globalBounds.nw.lat],
                    [globalBounds.ne.long, globalBounds.ne.lat],
                    [globalBounds.se.long, globalBounds.se.lat],
                    [globalBounds.sw.long, globalBounds.sw.lat],
                    [globalBounds.nw.long, globalBounds.nw.lat],
                ]
            ]
        }
    };
    return globalBoundsGEO
}

export function mapMain() {
    const allSensors = getSensors();
    const globalBounds = getGlobalBounds(allSensors);
    const globalBoundsGEO = getGlobalBoundsGEO(globalBounds);

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: centerCoordinates,
        zoom: 11.2
    });


    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    class HomeButton {
        onAdd(map) {
            const div = document.createElement("div");
            div.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
            div.innerHTML = `<button>
            <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="font-size: 20px;"><title>Reset map</title><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
            </button>`;
            div.addEventListener("contextmenu", (e) => e.preventDefault());
            div.addEventListener("click", () => {
                map.setCenter(centerCoordinates)
                map.setZoom(11.2)
            });
            return div;
        }
    }
    const homeButton = new HomeButton();
    map.addControl(homeButton, "bottom-right");

    map.on('load', function () {
        map.addLayer({
            id: 'mapCenter',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [centerCoordinates[0], centerCoordinates[1]]
                        }
                    }]
                }
            },
            // centre de la carte 
            paint: {
                'circle-radius': 4,
                'circle-color': 'blue'
            }
        });
        map.addLayer({
            id: 'grid',
            type: 'line',
            source: {
                type: 'geojson',
                data: globalBoundsGEO
            },
            paint: {
                'line-color': 'rgba(255,0,0,1)',
                'line-width': 3
            }
        });
        allSensors.forEach((sensor, i) => {
            var bound = getBounds(sensor)
            var grid_area = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [bound.nw.long, bound.nw.lat],
                            [bound.ne.long, bound.ne.lat],
                            [bound.se.long, bound.se.lat],
                            [bound.sw.long, bound.sw.lat],
                            [bound.nw.long, bound.nw.lat],
                        ]
                    ]
                }
            };
            map.addLayer({
                id: 'sensor-' + i,
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: grid_area
                },
                paint: {
                    'fill-color': 'rgba(255,0,0,0)',
                    'fill-outline-color': 'rgba(255,0,0,1)'
                }
            });
            map.addLayer({
                id: 'sensor-center-' + i,
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [sensor.center.long, sensor.center.lat]
                            }
                        }]
                    }
                },
                paint: {
                    'circle-radius': 3,
                    'circle-color': 'black'
                }
            });
            map.addLayer({
                id: 'sensor-label-' + i,
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [sensor.center.long, sensor.center.lat]
                            },
                            properties: {
                                label: '(' + sensor.id + ')'
                            }
                        }]
                    }
                },
                layout: {
                    'text-field': ['get', 'label'],
                    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                    'text-radial-offset': 0.5,
                    'text-justify': 'auto'
                },
                paint: {
                    'text-color': 'black',
                    'text-halo-color': 'white',
                    'text-halo-width': 0.5
                }
            });
        });
    });

    return map
}