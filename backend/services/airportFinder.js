import dotenv from "dotenv";
dotenv.config();
import airportData from "./airports_data.json" assert { type: "json" };

function calculateDistance(x1, y1, x2, y2) {
  return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
}

function getNearbyAirports(x, y) {
  const distances = airportData.map((airport) => {
    const distance = calculateDistance(
      x,
      y,
      airport.coordinates.x,
      airport.coordinates.y
    );
    return { ...airport, distance };
  });

  distances.sort((a, b) => a.distance - b.distance);
  return distances[0];
}

export default getNearbyAirports;
