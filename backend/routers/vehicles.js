const express = require("express");
const Vehicle = require("../models/vehicleModel");
const router = express.Router();
const checkRole = require("../middelwares/role");

router.get("/", async (req, res) => {
  try {
    const categoryId = req.query.category;
    const filter = categoryId ? { category: categoryId } : {};
    const vehicles = await Vehicle.find(filter).populate(
      "category",
      "name _id"
    );
    if (vehicles.length === 0) {
      return res.status(404).send({ error: "Vozila nisu pronađena." });
    }

    const availableVehicles = vehicles.filter((vehicel) => vehicel.isAvaiable);
    const notAvailableVehicles = vehicles.filter(
      (vehicle) => !vehicle.isAvaiable
    );
    res.status(200).json({
      vehicles: vehicles,
      availableVehicles: availableVehicles,
      notAvailableVehicles: notAvailableVehicles,
    });
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom dohvaćanja vozila." });
  }
});

router.get("/:id", async (req, res) => {
  const vehicleId = req.params.id;

  try {
    const vehicle = await Vehicle.findById(vehicleId).populate(
      "category",
      "name _id"
    );

    if (!vehicle) {
      return res
        .status(404)
        .send({ error: `Vozilo sa id: ${vehicleId} nije pronađeno.` });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom dohvaćanja vozila." });
  }
});

router.post("/", checkRole("admin"), async (req, res) => {
  const newVehicle = new Vehicle(req.body);
  try {
    await newVehicle.save();
    const vehicle = await Vehicle.findById(newVehicle._id).populate(
      "category",
      "name _id"
    );
    res.status(201).send({
      message: "Vozilo uspješno kreirano !",
      vehicle: vehicle,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/:id", checkRole("admin"), async (req, res) => {
  const vehicleId = req.params.id;
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, req.body, {
      new: true,
    });
    if (!vehicle) {
      return res.status(404).send(`Vozilo sa id: ${vehicleId} ne postoji`);
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom ažuriranja vozila." });
  }
});

router.delete("/:id", checkRole("admin"), async (req, res) => {
  const vehcileId = req.params.id;
  try {
    const vehicle = await Vehicle.findByIdAndDelete(vehcileId);
    if (!vehicle) {
      return res
        .status(404)
        .send({ error: `Vozilo sa id: ${vehcileId} nije pronađeno.` });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom brisanja vozila." });
  }
});

module.exports = router;
