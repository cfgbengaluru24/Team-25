import airportData from "./airports_data.json" assert { type: "json" };
import fs from "fs/promises";
import getCoordinates from "./geocode.js";

async function modifyData() {
  const modifiedData = await Promise.all(
    airportData.map(async (airport) => {
      const coordinates = await getCoordinates(
        `${airport.airport_name}, ${airport.city_name}`
      );
      return {
        ...airport,
        coordinates,
      };
    })
  );
  const outputFilePath = "./modified_airports_data.json";
  await fs.writeFile(outputFilePath, JSON.stringify(modifiedData, null, 2));
}

// Execute the function
modifyData().catch(console.error);
