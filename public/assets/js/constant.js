// export const apiKey = process.env.API_KEY;

const lyonCoordinates = [4.85, 45.75];
const villeurbanneCoordinates = [4.88, 45.77];
// Calculer le centre entre Lyon et Villeurbanne
export const centerCoordinates = [
    (lyonCoordinates[0] + villeurbanneCoordinates[0]) / 2,
    (lyonCoordinates[1] + villeurbanneCoordinates[1]) / 2
];
