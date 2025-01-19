const mongoose = require("mongoose");
const Reservation = require("../models/reservationModel");
const Vehicle = require("../models/vehicleModel");

const validateReservation = async (req, res, next) => {
  const reservation = req.body;
  const reservationId = req.params.id;
  const reqMethod = req.method;

  try {
    const reservations = await Reservation.find();
    const vehicle = await Vehicle.findById(reservation.vehicle);
    let reservationForUpdate = {};

    if (reqMethod === "PUT") {
      reservationForUpdate = await Reservation.findById(reservationId);
      if (!reservationForUpdate) {
        return res
          .status(400)
          .send({ error: `Rezervacija sa id: ${reservationId} ne postoji.` });
      }
    }

    if (!reservation) {
      return res.status(400).send({ error: "Nema podataka za rezervaciju." });
    }

    if (!reservation.purpose || reservation.purpose.trim() === "") {
      return res.status(400).send({
        error: "Svrha je obavezna. Navedite svrhu kreiranja rezervacije.",
      });
    }

    if (!reservation.vehicleCategory) {
      return res.status(400).send({
        error: "Kategorija vozila je obavezna. Navedite kategoriju vozila.",
      });
    }

    if (reservation.vehicleCategory === "-- Odaberi opciju") {
      return res.status(400).send({
        error:
          "Pogrešna kategorija vozila. Navedite ispravnu kategoriju vozila.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reservation.user)) {
      return res
        .status(400)
        .send({ error: "Korisnik mora biti validan ObjectId." });
    }

    if (
      !reservation.period ||
      !reservation.period.start ||
      !reservation.period.end
    ) {
      return res.status(400).send({
        error: "Period rezervacije (početak i kraj) je obavezan.",
      });
    }

    const startDate = new Date(reservation.period.start);
    const endDate = new Date(reservation.period.end);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).send({
        error: "Period rezervacije mora biti validan datum.",
      });
    }

    if (startDate > endDate) {
      return res.status(400).send({
        error: "Početni datum mora biti prije krajnjeg datuma.",
      });
    }

    const validStatuses = ["Na čekanju", "Odobreno", "Odbijeno", "Završeno"];
    if (reservation.status && !validStatuses.includes(reservation.status)) {
      return res.status(400).send({
        error: `Status mora biti jedna od sledećih vrednosti: ${validStatuses.join(
          ", "
        )}.`,
      });
    }

    if (reservation.status === "Odobreno") {
      if (!reservation.vehicle) {
        return res
          .status(400)
          .send({ error: "Navedite vozilo za odobrenu rezervaciju." });
      }

      if (!mongoose.Types.ObjectId.isValid(reservation.vehicle)) {
        return res
          .status(400)
          .send({ error: "Vozilo mora biti validan ObjectId." });
      }

      if (vehicle.category.toString() !== reservation.vehicleCategory) {
        return res
          .status(400)
          .send({ error: "Vozilo se ne poklapa sa odabranom kategorijom." });
      }

      if (reservations.length > 0) {
        const overlapReservations = reservations.filter((res) => {
          if (
            startDate > res.period?.start &&
            startDate <= res.period?.end &&
            res.status === "Odobreno"
          ) {
            return res;
          }
        });

        if (overlapReservations.length > 0) {
          const conflictedVehicle = overlapReservations.find((overlapRes) => {
            return (
              overlapRes.vehicle &&
              reservation.vehicle === overlapRes.vehicle.toString()
            );
          });

          const conflictedUser = overlapReservations.find((overlapRes) => {
            return (
              overlapRes.user && reservation.user === overlapRes.user.toString()
            );
          });

          if (conflictedVehicle) {
            return res.status(400).send({
              error: `Vozilo sa id: ${reservation.vehicle} je već zauzeto za rezervaciju ${conflictedVehicle._id}`,
            });
          }

          if (conflictedUser) {
            return res.status(400).send({
              error: `Zaposlenik sa id: ${reservation.user} već ima rezervaciju ${conflictedUser._id} u tom periodu.`,
            });
          }
        }
      }
    }

    if (reservation.status === "Odbijeno") {
      if (
        !reservation.reasonForRejection ||
        reservation.reasonForRejection.trim() === ""
      ) {
        return res
          .status(400)
          .send({ error: "Navedite razlog za odbijenu rezervaciju." });
      }
    }

    next();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = validateReservation;
