const express = require("express");
const cors = require("cors");
const checkToken = require("./middelwares/authorization");
const vehicleCategoryRouter = require("./routers/vehicleCategories");
const vehicleRouter = require("./routers/vehicles");
const userRouter = require("./routers/users");
const loginRouter = require("./routers/login");
const reservationRouter = require("./routers/reservations");
const vehicleMalfunctionRouter = require("./routers/vehicleMalfunction");
const connectDb = require("./config/dbConfig");
const checkExpiredReservations = require("./helpers/cronJobs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

connectDb();

checkExpiredReservations();

app.use("/login", loginRouter);
app.use("/vehicle-category", checkToken, vehicleCategoryRouter);
app.use("/vehicle", checkToken, vehicleRouter);
app.use("/users", checkToken, userRouter);
app.use("/reservations", checkToken, reservationRouter);
app.use("/vehicle-malfunction", checkToken, vehicleMalfunctionRouter);

app.listen(PORT, () => {
  console.log(`Server sluša zahtjeve na portu ${PORT}`);
});
