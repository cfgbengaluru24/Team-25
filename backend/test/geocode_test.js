import getCoordinates from "../services/geocode.js";

const address = "B-23, Yojna Vihar, Delhi, 110095, India";

getCoordinates(address)
  .then((coordinates) => {
    console.log(`Latitude: ${coordinates.x}, Longitude: ${coordinates.y}`);
  })
  .catch((error) => console.error("Error:", error));
