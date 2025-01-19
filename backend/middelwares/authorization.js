const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(403)
      .send({ error: "Ne postoji autorizacijsko zaglavlje." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).send({ error: "Bearer token nije pronađen" });
  }

  try {
    const decodedToken = jwt.verify(token, "secretKey");
    req.user = decodedToken;
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
  return next();
};

module.exports = checkToken;
