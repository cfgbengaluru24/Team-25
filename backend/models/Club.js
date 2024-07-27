import mongoose from "mongoose";
import validator from "validator";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import {
  BadRequestError,
  TooManyRequests,
  UnauthenticatedError,
} from "../Errors/index.js";

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the Name"],
    minlength: 3,
    maxlength: 30,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide the Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  otp: {
    code: {
      type: String,
    },
    genTime: {
      type: Number,
    },
    tries: {
      type: Number,
      default: 0,
      max: 3,
    },
  },
  logo: {
    type: String,
  },
  video: {
    type: String,
  },
  fullName: {
    type: String,
  },
  tagLine: {
    type: String,
    maxlength: 100,
    default: "",
  },
  description: {
    type: String,
    maxlength: 1500,
    default: "",
  },
  points: [
    {
      points: {
        type: Number,
        default: 0,
        min: 0,
      },
      description: {
        type: String,
      },
    },
  ],
  faemail: {
    type: String,
    required: [true, "Please provide the Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
});

ClubSchema.pre("save", async function () {
  if (!this.isModified("otp.code")) return;
  if (!this.otp.code) return;
  const salt = await bycrypt.genSalt(10);
  this.otp.code = await bycrypt.hash(this.otp.code, salt);
});

ClubSchema.methods.generateOTP = function () {
  const resendTime = parseInt(process.env.OTP_RESEND);
  const currentTime = moment().unix();
  if (
    this.otp &&
    this.otp?.genTime &&
    this.otp?.genTime + resendTime > currentTime
  ) {
    throw new TooManyRequests("Wait before sending OTP");
  }
  const otpLength = process.env.OTP_LENGTH;
  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum.toString();
};

ClubSchema.methods.checkOTP = async function (code) {
  if (!this.otp.code) {
    throw new BadRequestError("Request new OTP");
  }
  if (this.otp.tries === 3) {
    throw new TooManyRequests("Too many incorrect attempts!");
  }
  const currentTime = moment().unix();
  if (this.otp?.genTime + parseInt(process.env.OTP_EXPIRY) <= currentTime) {
    throw new UnauthenticatedError("Invalid OTP");
  }
  const isMatch = await bycrypt.compare(code, this.otp.code);
  console.log(code);
  console.log(this.otp.code);
  if (!isMatch) {
    this.otp.tries = this.otp.tries + 1;
    this.save();
    throw new UnauthenticatedError("Invalid OTP");
  }
  this.otp = {
    tries: 0,
  };
  await this.save();
};

ClubSchema.methods.createJWT = function (rememberUser) {
  return jwt.sign(
    { userId: this._id, userRole: "club" },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberUser
        ? process.env.JWT_LONG_LIFETIME
        : process.env.JWT_LIFETIME,
    }
  );
};

export default mongoose.model("Club", ClubSchema);
