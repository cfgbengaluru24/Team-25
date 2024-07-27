import mongoose from "mongoose";
import validator from "validator";

const TrainerSchema = new mongoose.Schema({
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
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: [true, "Please provide the user gender"],
  },
  camp_counts: {
    type: Number,
    default: 0,
  },
  geolocation: {
    x: {
      type: Number,
      required: [true, "Please provide the x coordinate"],
    },
    y: {
      type: Number,
      required: [true, "Please provide the y coordinate"],
    },
  },
  sessions_applied: [
    {
      date: {
        type: Date,
        required: [true, "Please provide the date"],
      },
      is_selected: {
        type: Boolean,
      },
    },
  ],
});

export default mongoose.model("Trainer", TrainerSchema);
