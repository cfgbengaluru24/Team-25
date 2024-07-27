import express from "express";
const router = express.Router();

import rateLimiter from "express-rate-limit";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again after 15 minutes",
});

import { helloWorld } from "../controllers/sampleController.js";

router.route("/hello-world").get(apiLimiter, helloWorld);

export default router;
