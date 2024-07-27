import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEO_API_KEY;

async function getCoordinates(address) {
  console.log(address);
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${apiKey}`;
  const response = await axios.get(url);
  if (
    response.data &&
    response.data.features &&
    response.data.features.length > 0
  ) {
    const { lat, lon } = response.data.features[0].properties;
    return { x: lat, y: lon };
  } else {
    throw new Error("No coordinates found for the given address.");
  }
}

export default getCoordinates;
