const mongoose = require("mongoose");
const VehicleMalfunction = require("../models/vehicleMalfunctionModel");
const Reservation = require("../models/reservationModel");

const validateVehicleMalfunction = async (req, res, next) => {
  const { vehicle, description, user } = req.body;

  try {
    const existingVehicleMalfunction = await VehicleMalfunction.findOne({
      vehicle: vehicle,
    });

    if (existingVehicleMalfunction) {
      return res.status(400).send({
        error: `Kvar već postoji za vozilo s ID-jem: ${vehicle}`,
      });
    }

    if (!vehicle) {
      return res.status(400).send({
        error:
          "Vozilo je obavezno. Navedite vozilo za koje prijavljujete kvar.",
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).send({
        error: "Opis je obavezan. Navedite opis kvara.",
      });
    }

    if (!user) {
      return res.status(400).send({
        error:
          "Korisnik je obavezan. Navedite korisnika koji prijavljuje kvar.",
      });
    }

    const affectedReservations = await Reservation.updateMany(
      { vehicle: vehicle, status: "Odobreno" },
      { $set: { status: "Na čekanju" } }
    );

    if (affectedReservations.nModified > 0) {
      console.log(
        `${affectedReservations.nModified} rezervacija promijenjeno u "Na čekanju".`
      );
    }

    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Došlo je do greške na serveru." });
  }
};

module.exports = validateVehicleMalfunction;
