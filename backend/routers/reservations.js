const express = require("express");
const Reservation = require("../models/reservationModel");
const router = express.Router();
const checkRole = require("../middelwares/role");
const validateReservation = require("../middelwares/reservationValidation");

router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("vehicleCategory", "name _id")
      .populate("user", "email username _id");
    if (reservations.length === 0) {
      return res
        .status(404)
        .send({ error: "Nema novo kreiranih rezervacija." });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/new-created", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: "Na čekanju",
    })
      .populate("vehicleCategory", "name _id")
      .populate("user", "email username _id");
    if (reservations.length === 0) {
      return res
        .status(404)
        .send({ error: "Nema novo kreiranih rezervacija." });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/new-created/:id", async (req, res) => {
  const reservationId = req.params.id;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res
        .status(404)
        .send({ error: `Rezervacija sa id: ${reservationId} nije pronađena.` });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post(
  "/new-created",
  checkRole("zaposlenik"),
  validateReservation,
  async (req, res) => {
    const newReservation = new Reservation(req.body);
    try {
      await newReservation.save();
      res.status(201).send({
        message: "Rezervacija se uspješno kreirana.",
        reservation: newReservation,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.put(
  "/new-created/:id",
  checkRole("admin"),
  validateReservation,
  async (req, res) => {
    const reservationId = req.params.id;
    const updatedReservation = req.body;

    try {
      if (updatedReservation.status === "Odobreno") {
        updatedReservation.reasonForRejection = null;
      }

      if (updatedReservation.status === "Odbijeno") {
        updatedReservation.vehicle = null;
      }

      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        updatedReservation,
        { new: true }
      );

      if (!reservation) {
        return res.status(404).send({
          error: `Rezervacija sa id: ${reservationId} nije pronađenda.`,
        });
      }

      if (reservation.status === "Odobreno") {
        res.status(200).send({
          message: `Rezervacija sa id: ${reservationId} uspješno odobrena.`,
          reservation: reservation,
        });
      }

      if (reservation.status === "Odbijeno") {
        res.status(200).send({
          message: `Rezervacija sa id: ${reservationId} uspješno odbijena.`,
          reservation: reservation,
        });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.delete("/new-created/:id", checkRole("zaposlenik"), async (req, res) => {
  const reservationId = req.params.id;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).send({
        error: `Rezervacija sa id: ${reservationId} nije pronađenda.`,
      });
    }

    const currentDate = new Date();

    if (currentDate >= reservation.period.start) {
      return res.status(400).send({
        error: "Ne možete otkazati rezervaciju koja je već započela.",
      });
    }

    const deletedReservation = await Reservation.findByIdAndDelete(
      reservationId
    );

    res.status(200).send({
      message: `Rezervacija sa id: ${reservationId} uspješno otkazana.`,
      reservation: deletedReservation,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/approved/:vehicleId", async (req, res) => {
  const vehicleId = req.params.vehicleId;
  try {
    const reservations = await Reservation.find({
      vehicle: vehicleId,
      status: "Odobreno",
    });
    if (reservations.length === 0) {
      return res.status(404).send({
        error: `Nema odobrenih rezervacija za vozilo ${vehicleId}.`,
      });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/approved", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: "Odobreno",
    })
      .populate("vehicleCategory", "name _id")
      .populate("vehicle", "model _id")
      .populate("user", "email _id");
    if (reservations.length === 0) {
      return res.status(404).send({ error: "Nema odobrenih rezervacija." });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/rejected", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: "Odbijeno",
    })
      .populate("vehicleCategory", "name _id")
      .populate("user", "email _id");
    if (reservations.length === 0) {
      return res.status(404).send({ error: "Nema odbijenih rezervacija." });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/finished", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      status: "Završeno",
    })
      .populate("vehicleCategory", "name _id")
      .populate("vehicle", "model _id")
      .populate("user", "email _id");
    if (reservations.length === 0) {
      return res.status(404).send({ error: "Nema završenih rezervacija." });
    }
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/finished/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const deletedReservation = await Reservation.findByIdAndDelete(
      reservationId
    );
    if (!deletedReservation) {
      return res.status(404).send({
        error: `Istekla rezervacija sa id: ${reservationId} nije pronađena.`,
      });
    }
    res.status(200).json({
      message: `Istekla rezervacija sa ${reservationId} je uspješno izbrisana.`,
      deletedReservation: deletedReservation,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Greška prilikom brisanja istekle rezervacije." });
  }
});

module.exports = router;
