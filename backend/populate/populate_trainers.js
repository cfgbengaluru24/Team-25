import dotenv from "dotenv";
import mockitoData from "./mock_trainers.json" assert { type: "json" };
import connectDB from "../db/connect.js";
import getCoordinates from "../services/geocode.js";
import Trainer from "../models/Trainer.js";
import generateSessionsApplied from "../utils/generateSessionsArray.js";
dotenv.config();

const addresses = [
  "Gf 9, 94 Megh Doot, Delhi, India",
  "3/pc-4, Kambar Salai, West Mugappair, Chennai, Tamil Nadu, India",
  "213, Mehta Mansion, Dr N.g Mahintura Marg, Girgaon, Mumbai, Maharashtra, India",
  "134a/j, No 9, 1st Floor, Auto Towers, J C Road, Bangalore, Karnataka, India",
  "C 242, Noida, Noida, Delhi, India",
  "Nr Laxmi Estate, New Link Rd, Andheri(w), Mumbai, Maharashtra, India",
  "Spencer Plaza, 4-b, 1st Flr, 769, Anna Salai, Chennai, Tamil Nadu, India",
  "307, Kucha Mir Ashiq, Chawri Bazar, Delhi, India",
  "3, Garg Complex, 2nd Floor, Opp PWD Rest House, Nr Thapar University, Bhupindra Rd, Patiala, Punjab, India",
  "Ramkote, Hyderabad, Andhra Pradesh, India",
  "A-1139, New Subzi Mandi, Azadpur, Delhi, India",
  "391, Circle House, S M Rd, Matunga (c.r), Mumbai, Maharashtra, India",
  "19/3, Hosur Main Road, Opp Hotel Shanti Sagar, Madiwala, Bangalore, Karnataka, India",
  "Shop No 10, 1st Floor, M G Road, Hyderabad, Andhra Pradesh, India",
];

async function populateTrainers() {
  const trainers = [];
  const sessionsApplied = generateSessionsApplied();

  for (let trainerData of mockitoData) {
    const randomAddress =
      addresses[Math.floor(Math.random() * addresses.length)];
    const geolocation = await getCoordinates(randomAddress);

    trainers.push({
      name: trainerData.name,
      email: trainerData.email,
      gender: trainerData.gender.toLowerCase(),
      camp_counts: trainerData.camp_counts,
      geolocation,
      sessions_applied: sessionsApplied,
    });
  }

  await Trainer.insertMany(trainers);
  console.log("All trainers have been saved.");
}

await connectDB(process.env.MONGO_URL);
console.log("Connected to the database.");

await Trainer.deleteMany({});
console.log("Deleted previous trainers.");

await populateTrainers();
