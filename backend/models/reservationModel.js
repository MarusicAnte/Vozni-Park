const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  purpose: { type: String, required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  vehicleCategory: {
    type: Schema.Types.ObjectId,
    ref: "VehicleCategory",
    required: true,
  },
  status: {
    type: String,
    enum: ["Na čekanju", "Odobreno", "Odbijeno", "Završeno"],
    default: "Na čekanju",
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    default: null,
  },
  reasonForRejection: {
    type: String,
    default: null,
  },
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = Reservation;
