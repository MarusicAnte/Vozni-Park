const express = require("express");
const VehicleCategory = require("../models/vehicleCategoryModel");
const router = express.Router();
const checkRole = require("../middelwares/role");

router.get("/", async (req, res) => {
  try {
    const vehicleCategories = await VehicleCategory.find();
    if (vehicleCategories.length === 0) {
      return res
        .status(404)
        .send({ error: "Kategorija vozila nisu pronađene." });
    }
    res.status(200).json(vehicleCategories);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Greška prilikom dohvaćanja kategorija vozila." });
  }
});

router.post("/", checkRole("admin"), async (req, res) => {
  const category = new VehicleCategory(req.body);
  try {
    await category.save();
    res
      .status(201)
      .send({ message: "Kateogirja uspješno kreirana !", category: category });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/:id", checkRole("admin"), async (req, res) => {
  const vehicleCategoryId = req.params.id;
  try {
    const vehicleCategory = await VehicleCategory.findByIdAndDelete(
      vehicleCategoryId
    );
    if (!vehicleCategory) {
      return res
        .status(404)
        .send({ error: "Kategorija vozila nije pronađena." });
    }
    res.status(200).send({
      message: "Kategorija vozila uspješno obrisana.",
      category: vehicleCategory,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Greška prilikom brisanja kategorije vozila." });
  }
});

module.exports = router;
