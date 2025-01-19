const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const bcrypt = require("bcrypt");
const checkRole = require("../middelwares/role");
const validateUser = require("../middelwares/userValidation");

const saltRunde = 10;

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).send({ error: "Korisnici nisu pronađeni." });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom dohvaćanja korisnika." });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ error: `Korsinik sa id: ${userId} nije pronađen.` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom dohvaćanja korisnika." });
  }
});

router.put("/:id", checkRole("admin"), async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      return res
        .status(404)
        .send({ error: `Korisnik sa id: ${userId} nije pronađen.` });
    }
    res.status(200).send({
      message: `Korisnika sa id ${userId} uspješno ažuriran.`,
      user: user,
    });
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom ažuriranja korisnika." });
  }
});

router.delete("/:id", checkRole("admin"), async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .send({ error: `Korisnik sa id: ${userId} nije pronađen.` });
    }
    res.status(200).json({
      message: `Korisnik sa ${userId} je uspješno izbrisan.`,
      user: user,
    });
  } catch (error) {
    res.status(500).send({ error: "Greška prilikom brisanja korisnika." });
  }
});

router.post(
  "/registration",
  checkRole("admin"),
  validateUser,
  async (req, res) => {
    try {
      const hashPassword = await bcrypt.hash(req.body.password, saltRunde);
      const newUser = new User({ ...req.body, password: hashPassword });
      await newUser.save();
      res
        .status(201)
        .send({ message: "Korisnik je uspješno kreiran.", user: newUser });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
