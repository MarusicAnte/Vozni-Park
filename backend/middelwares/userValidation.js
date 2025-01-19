// const User = require("../models/userModel");

// const validateUser = async (req, res, next) => {
//   const userFromRequest = req.body;

//   if (!userFromRequest) {
//     return res.status(400).send({ error: "Nema podataka za korisnika." });
//   }

//   try {
//     const validateField = (field, errorMessage) => {
//       if (!field) {
//         return res.status(400).send({ error: errorMessage });
//       }
//     };

//     validateField(userFromRequest.imageURL, "Slika korisnika je obavezna.");
//     validateField(
//       userFromRequest.fullName,
//       "Ime i prezime korisnika je obavezno."
//     );
//     validateField(userFromRequest.username, "Username korisnika je obavezan.");
//     validateField(userFromRequest.email, "Email korisnika je obavezan.");
//     validateField(userFromRequest.password, "Password korisnika je obavezan.");
//     validateField(userFromRequest.role, "Uloga korisnika je obavezna.");

//     const existedImgURL = await User.findOne({
//       imageURL: userFromRequest.imageURL,
//     });
//     const existedUsername = await User.findOne({
//       username: userFromRequest.username,
//     });
//     const existedEmail = await User.findOne({ email: userFromRequest.email });

//     if (existedImgURL) {
//       return res.status(400).send({
//         error: `Korisnik sa slikom čiji je URL: ${userFromRequest.imageURL} već postoji.`,
//       });
//     }

//     if (existedUsername) {
//       return res.status(400).send({
//         error: `Korisnik čiji je username: ${userFromRequest.username} već postoji.`,
//       });
//     }

//     if (existedEmail) {
//       return res.status(400).send({
//         error: `Korisnik sa emailom: ${userFromRequest.email} već postoji.`,
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// };

// module.exports = validateUser;

const User = require("../models/userModel");

const validateUser = async (req, res, next) => {
  const userFromRequest = req.body;

  if (!userFromRequest) {
    return res.status(400).send({ error: "Nema podataka za korisnika." });
  }

  try {
    const validateField = (field, errorMessage) => {
      if (!field) {
        return res.status(400).send({ error: errorMessage });
      }
    };

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidURL = (url) => {
      const urlRegex =
        /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-_\/]*)*(\.[a-zA-Z0-9]{2,})?$/;
      return urlRegex.test(url);
    };

    validateField(userFromRequest.imageURL, "Slika korisnika je obavezna.");
    if (!isValidURL(userFromRequest.imageURL)) {
      return res
        .status(400)
        .send({ error: "URL slike nije validan. Unesite ispravan URL." });
    }

    validateField(
      userFromRequest.fullName,
      "Ime i prezime korisnika je obavezno."
    );
    validateField(userFromRequest.username, "Username korisnika je obavezan.");
    validateField(userFromRequest.email, "Email korisnika je obavezan.");
    if (!isValidEmail(userFromRequest.email)) {
      return res
        .status(400)
        .send({ error: "Email nije validan. Unesite ispravan email." });
    }
    validateField(userFromRequest.password, "Password korisnika je obavezan.");
    validateField(userFromRequest.role, "Uloga korisnika je obavezna.");

    const existedImgURL = await User.findOne({
      imageURL: userFromRequest.imageURL,
    });
    const existedUsername = await User.findOne({
      username: userFromRequest.username,
    });
    const existedEmail = await User.findOne({ email: userFromRequest.email });

    if (existedImgURL) {
      return res.status(400).send({
        error: `Korisnik sa slikom čiji je URL: ${userFromRequest.imageURL} već postoji.`,
      });
    }

    if (existedUsername) {
      return res.status(400).send({
        error: `Korisnik čiji je username: ${userFromRequest.username} već postoji.`,
      });
    }

    if (existedEmail) {
      return res.status(400).send({
        error: `Korisnik sa emailom: ${userFromRequest.email} već postoji.`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = validateUser;
