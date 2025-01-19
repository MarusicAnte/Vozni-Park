const mongoose = require("mongoose");
const { Schema } = mongoose;

const vehicleCategorySchema = new Schema({
  name: { type: String, unique: true, required: true },
});

const VehicleCategory = mongoose.model(
  "VehicleCategory",
  vehicleCategorySchema
);

module.exports = VehicleCategory;
