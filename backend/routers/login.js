const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = "secretKey";

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email: ", email);
    console.log("Password: ", password);

    if (!email || !password) {
      return res.status(400).send({ error: "Email i password su obavezni." });
    }

    const userDb = await User.findOne({ email: req.body.email });

    console.log("userDB: ", userDb);

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userDb.password
    );
    if (userDb && isPasswordValid) {
      const token = jwt.sign(
        {
          id: userDb._id,
          role: userDb.role,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).send({ message: "Uspješna prijava.", token: token });
    } else {
      res.status(404).send({ error: "Neispravni podaci za prijavu." });
    }
  } catch (error) {
    res.status(404).send({ error: "Neispravni podaci za prijavu." });
  }
});

router.get("/user/:id", async (req, res) => {
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

module.exports = router;
