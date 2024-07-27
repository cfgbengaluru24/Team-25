import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../Errors/index.js";
import axios from "axios";

export const helloWorld = async (req, res) => {
  const randomInteger = req.random;
  if (!randomInteger) {
    throw new BadRequestError("Random Integer not found");
  }
  const response = await axios.post("http://127.0.0.1:5000/predict", {
    number: randomInteger,
  });
  const prediction = response.data.prediction;
  res
    .status(StatusCodes.OK)
    .json({ msg: `Hello World ${randomInteger} - ${prediction}` });
};
