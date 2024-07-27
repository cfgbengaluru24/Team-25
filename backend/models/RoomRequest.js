import mongoose from "mongoose";

const RoomRequestSchema = new mongoose.Schema({
  requestedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Club",
    required: [true, "Please provide the club id"],
  },
  functionType: {
    type: String,
    required: [true, "Please provide the funciton type"],
  },
  pointOfContact: {
    name: {
      type: String,
      required: [true, "Please provide the POC name"],
    },
    registrationNumber: {
      type: String,
      required: [true, "Please provide the POC registeration number"],
    },
    contactNumber: {
      type: String,
      required: [true, "Please provide the POC name"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
  },
  purpose: {
    type: String,
    minlength: 10,
    maxlength: 200,
    required: [true, "Please provide the purpose"],
  },
  equipmentRequired: [
    {
      type: String,
    },
  ],
  placeRequired: {
    building: {
      type: String,
      required: [true, "Please provide the place details"],
    },
    roomNumber: {
      type: String,
      required: [true, "Please provide the place details"],
    },
  },
  functionDescription: {
    type: String,
  },
  date: {
    type: Date,
    required: [true, "Please provide the start date"],
  },
  approvals: {
    facultyAdvisor: {
      approved: {
        type: Boolean,
      },
      remarks: {
        type: String,
      },
    },
    swo: {
      approved: {
        type: Boolean,
      },
      remarks: {
        type: String,
      },
    },
    security: {
      approved: {
        type: Boolean,
      },
      remarks: {
        type: String,
      },
    },
  },
});

export default mongoose.model("RoomRequest", RoomRequestSchema);
