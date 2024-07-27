import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../Errors/index.js";
import getCoordinates from "../services/geocode.js";
import Trainer from "../models/Trainer.js";
import generateSessionsApplied from "../utils/generateSessionsArray.js";
import findNearbyAirport from "../services/airportFinder.js";
import getDistance from "../services/findDistance.js";

const stations = [
  "YPR",
  "NDLS",
  "SBC",
  "PUNE",
  "ADI",
  "MAS",
  "KYN",
  "ADI",
  "PBE",
];

const getRandomStations = (stationArray) => {
  if (stationArray.length < 2) {
    throw new Error("Not enough stations to select from.");
  }
  let srcStation, destStation;
  do {
    srcStation = stationArray[Math.floor(Math.random() * stationArray.length)];
    destStation = stationArray[Math.floor(Math.random() * stationArray.length)];
  } while (srcStation === destStation);
  return { srcStation, destStation };
};

export const createTrainer = async (req, res) => {
  const { name, email, gender, address } = req.body;
  if (!address || !name || !email || !gender) {
    throw new BadRequestError("Name, Email, Address, Gender are required");
  }

  const geolocation = await getCoordinates(address);
  if (!geolocation) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Unable to fetch geolocation for the provided address.",
    });
  }

  const sessionsApplied = generateSessionsApplied();

  const newTrainer = new Trainer({
    name,
    email,
    gender,
    geolocation,
    sessions_applied: sessionsApplied,
  });

  await newTrainer.save();
  res.status(StatusCodes.OK).json({ msg: "Trainer saved succesfully" });
};

export const getBestTrainers = async (req, res) => {
  const { selected_date, address } = req.body;
  if (!selected_date || !address) {
    throw new BadRequestError("Selected Date and address are required");
  }
  const formattedDate = new Date(selected_date).toISOString().split("T")[0];
  const geolocation = await getCoordinates(address);
  if (!geolocation) {
    throw new BadRequestError(
      "Unable to fetch geolocation for the provided address."
    );
  }

  const { x, y } = geolocation;

  const maleCount = await Trainer.countDocuments({
    sessions_applied: {
      $elemMatch: {
        date: new Date(formattedDate),
        is_selected: true,
      },
    },
    gender: "male",
  });

  const femaleCount = await Trainer.countDocuments({
    sessions_applied: {
      $elemMatch: {
        date: new Date(formattedDate),
        is_selected: true,
      },
    },
    gender: "female",
  });

  const selectedTrainers = await Trainer.find(
    {
      sessions_applied: {
        $elemMatch: {
          date: new Date(formattedDate),
          is_selected: true,
        },
      },
    },
    { sessions_applied: 0 }
  );

  if (maleCount + femaleCount >= 10) {
    res.status(StatusCodes.OK).json({ trainers: [], selectedTrainers });
  }

  const maleAvailableCount = await Trainer.countDocuments({
    sessions_applied: {
      $elemMatch: {
        date: new Date(formattedDate),
        is_selected: { $exists: false },
      },
    },
    gender: "male",
  });

  const femaleAvailableCount = await Trainer.countDocuments({
    sessions_applied: {
      $elemMatch: {
        date: new Date(formattedDate),
        is_selected: { $exists: false },
      },
    },
    gender: "female",
  });

  let query = {
    sessions_applied: {
      $elemMatch: {
        date: new Date(formattedDate),
        is_selected: { $exists: false },
      },
    },
  };

  if (maleCount >= 4 && femaleCount < 4 && femaleAvailableCount > 0) {
    query = { ...query, gender: "female" };
  }
  if (femaleCount >= 4 && maleCount < 4 && maleAvailableCount > 0) {
    query = { ...query, gender: "male" };
  }

  const R = 6371;
  const PI = Math.PI;

  const trainers = await Trainer.aggregate([
    { $match: query },
    {
      $addFields: {
        experience_score: {
          $switch: {
            branches: [
              { case: { $gt: ["$camp_counts", 15] }, then: 1 },
              { case: { $gt: ["$camp_counts", 10] }, then: 2 },
              { case: { $gt: ["$camp_counts", 5] }, then: 3 },
              { case: { $gte: ["$camp_counts", 0] }, then: 4 },
            ],
            default: 5,
          },
        },
        distance: {
          $let: {
            vars: {
              lat1: { $multiply: ["$geolocation.y", PI / 180] },
              lon1: { $multiply: ["$geolocation.x", PI / 180] },
              lat2: { $multiply: [y, PI / 180] },
              lon2: { $multiply: [x, PI / 180] },
            },
            in: {
              $multiply: [
                R,
                {
                  $acos: {
                    $add: [
                      { $multiply: [{ $sin: "$$lat1" }, { $sin: "$$lat2" }] },
                      {
                        $multiply: [
                          { $cos: "$$lat1" },
                          { $cos: "$$lat2" },
                          { $cos: { $subtract: ["$$lon1", "$$lon2"] } },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $unset: "sessions_applied",
    },
    {
      $sort: {
        experience_score: 1,
        distance: 1,
      },
    },
    { $limit: 10 },
  ]);

  res.status(StatusCodes.OK).json({ trainers, selectedTrainers });
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const getCheapestFlights = async (req, res) => {
  const { location, date } = req.body;
  if (!location || !date) {
    throw new BadRequestError("Location is required, date is required");
  }
  const dateObj = new Date(date);
  const formattedDate = formatDate(dateObj);
  const coordinates = await getCoordinates(location);
  const locationAirports = await findNearbyAirport(
    coordinates.x,
    coordinates.y
  );
  const trainers = await Trainer.find({}, { sessions_applied: 0 });
  const trainers_updated = await Promise.all(
    trainers.map(async (trainer) => {
      const trainerObj = trainer.toObject();
      const airport = await findNearbyAirport(
        trainerObj.geolocation.x,
        trainerObj.geolocation.y
      );
      const distance = await getDistance(
        trainerObj.geolocation.x,
        trainerObj.geolocation.y,
        coordinates.x,
        coordinates.y
      );
      trainerObj.airport = airport;
      trainerObj.distance = distance / 1000;
      if (trainerObj.distance < 35) {
        trainerObj.mode = "own";
      } else if (trainerObj.distance < 200) {
        trainerObj.mode = "bus";
        trainerObj.bookingUrl = `https://www.makemytrip.com/bus/search/${trainerObj.airport.city_name}/${locationAirports.city_name}/30-07-2024`;
      } else if (trainerObj.distance < 300) {
        trainerObj.mode = "train";
        const { srcStation, destStation } = getRandomStations(stations);
        trainerObj.bookingUrl =
          trainerObj.bookingUrl = `https://www.makemytrip.com/railways/listing?classCode=&className=All%20Classes&date=20240729&destStn=${destStation}&srcStn=${srcStation}`;
      } else {
        trainerObj.mode = "flight";
        trainerObj.bookingUrl = `https://www.makemytrip.com/flight/search?itinerary=${trainerObj.airport.IATA_code}-${locationAirports.IATA_code}-${formattedDate}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=IN&lang=eng`;
      }
      return trainerObj;
    })
  );
  res.status(StatusCodes.OK).json({ trainers: trainers_updated });
};

export const selectTrainer = async (req, res) => {
  const { id, session_date } = req.body;
  if (!id || !session_date) {
    throw new BadRequestError("Trainer ID and Session Date are required");
  }
  const trainer = await Trainer.findById(id);
  if (!trainer) {
    throw new BadRequestError("Trainer not found");
  }
  const sessionIndex = trainer.sessions_applied.findIndex(
    (session) =>
      session.date.toISOString() ===
      new Date(session_date.split("T")[0]).toISOString()
  );
  if (sessionIndex === -1) {
    throw new BadRequestError("Trainer session not found");
  }
  trainer.sessions_applied[sessionIndex].is_selected = true;
  await trainer.save();
  res.status(StatusCodes.OK).json({ trainer });
};

export const rejectTrainer = async (req, res) => {
  const { id, session_date } = req.body;
  if (!id || !session_date) {
    throw new BadRequestError("Trainer ID and Session Date are required");
  }
  const trainer = await Trainer.findById(id);
  if (!trainer) {
    throw new BadRequestError("Trainer not found");
  }
  const sessionIndex = trainer.sessions_applied.findIndex(
    (session) =>
      session.date.toISOString() ===
      new Date(session_date.split("T")[0]).toISOString()
  );
  if (sessionIndex === -1) {
    throw new BadRequestError("Trainer session not found");
  }
  trainer.sessions_applied[sessionIndex].is_selected = false;
  await trainer.save();
  res.status(StatusCodes.OK).json({ trainer });
};
