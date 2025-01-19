const mongoose = require("mongoose");
const { Schema } = mongoose;

const VehicleMalfunctionSchema = new Schema({
  vehicle: { type: Schema.ObjectId, ref: "Vehicle", required: true },
  description: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const VehicleMalfunction = mongoose.model(
  "VehicleMalfunction",
  VehicleMalfunctionSchema
);

module.exports = VehicleMalfunction;
