import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../Errors/index.js";
import getCoordinates from "../services/geocode.js";
import Trainer from "../models/Trainer.js";
import generateSessionsApplied from "../utils/generateSessionsArray.js";

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
          $add: [
            { $pow: [{ $subtract: ["$geolocation.x", x] }, 2] },
            { $pow: [{ $subtract: ["$geolocation.y", y] }, 2] },
          ],
        },
      },
    },
    {
      $sort: {
        experience_score: 1,
        distance: 1,
      },
    },
    { $limit: 10 },
  ]);
  res.status(StatusCodes.OK).json({ trainers });
};
