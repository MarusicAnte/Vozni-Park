const express = require("express");
const VehicleMalfunction = require("../models/vehicleMalfunctionModel");
const Vehicle = require("../models/vehicleModel");
const router = express.Router();
const checkRole = require("../middelwares/role");
const validateVehicleMalfunction = require("../middelwares/vehicleMalfunctionValidation");

router.get("/", async (req, res) => {
  try {
    const vehicleMalfunctions = await VehicleMalfunction.find()
      .populate({
        path: "vehicle",
        select: "_id model year category vin",
        populate: {
          path: "category",
          select: "_id name",
        },
      })
      .populate("user", "_id email");
    if (vehicleMalfunctions.length === 0) {
      return res.status(404).send({ error: "Kvarovi vozila nisu pronađeni." });
    }
    res.status(200).json(vehicleMalfunctions);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Greška prilikom dohvaćanja kvarova vozila." });
  }
});

router.post(
  "/:vehicleId",
  checkRole("zaposlenik"),
  validateVehicleMalfunction,
  async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const vehicleMalfunction = new VehicleMalfunction(req.body);

    try {
      await vehicleMalfunction.save();

      await Vehicle.findByIdAndUpdate(vehicleId, { isAvaiable: false });

      res.status(201).send({
        message: `Kvar za vozilo sa id: ${vehicleId} uspješno kreiran`,
        vehicleMalfunction: vehicleMalfunction,
      });
    } catch (error) {
      res
        .status(500)
        .send({ error: "Došlo je do greške prilikom prijave kvara." });
    }
  }
);

router.delete("/:id", checkRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const vehicleMalfunction = await VehicleMalfunction.findByIdAndDelete(id);

    if (!vehicleMalfunction) {
      return res.status(404).send({
        error: `Nije pronađen prijavljeni kvar za vozilo sa id: ${vehicleMalfunction.vehicle}`,
      });
    }

    await Vehicle.findByIdAndUpdate(vehicleMalfunction.vehicle, {
      isAvaiable: true,
    });

    res
      .status(200)
      .send({ message: "Kvar uspješno uklonjen i vozilo je opet dostupno." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      error: "Došlo je do greške prilikom brisanja prijave kvara.",
    });
  }
});

module.exports = router;
