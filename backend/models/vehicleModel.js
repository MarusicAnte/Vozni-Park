const mongoose = require("mongoose");
const { Schema } = mongoose;

const vehicleSchema = new Schema({
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: "VehicleCategory",
    required: true,
  },
  vin: {
    type: String,
    unique: true,
    match: /^[A-Z]{2}-\d{3,4}-[A-Z]{2}$/,
    required: true,
  },
  imageURL: { type: String, required: true },
  isAvaiable: { type: Boolean, required: true },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
