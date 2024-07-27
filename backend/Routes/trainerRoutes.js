import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";
import {
  createTrainer,
  getBestTrainers,
  getCheapestFlights,
  rejectTrainer,
  selectTrainer,
} from "../controllers/trainerController.js";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again after 15 minutes",
});

router.route("/get-trainers").post(apiLimiter, getBestTrainers);
router.route("/get-flights").get(apiLimiter, getCheapestFlights);
router.route("/create-trainer").post(apiLimiter, createTrainer);
router.route("/accept").post(apiLimiter, selectTrainer);
router.route("/reject").post(apiLimiter, rejectTrainer);

export default router;
