import CustomAPIError from "./custom-api.js";
import { StatusCodes } from "http-status-codes";

class TooManyRequests extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.TOO_MANY_REQUESTS;
  }
}

export default TooManyRequests;
