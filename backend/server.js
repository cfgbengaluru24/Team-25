import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

// import helmet from "helmet";
// import xss from "xss-clean";
// import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";

//router
import sampleRouter from "./Routes/sampleRoutes.js";

//middleware
import sampleMiddleware from "./middleware/sampleMiddleware.js";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import morgan from "morgan";

import connectDB from "./db/connect.js";

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT;

app.use(cors());
app.use(cookieParser());

// app.use(helmet());
// app.use(xss());
// app.use(mongoSanitize());

app.use("/api/v1/sample", sampleMiddleware, sampleRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
