const cron = require("node-cron");
const Reservation = require("../models/reservationModel");

const checkExpiredReservations = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Pokrenuta provjera isteka rezervacija...");

    const currentDate = new Date();
    console.log("Current Date: ", currentDate.toISOString());

    try {
      const expiredReservations = await Reservation.find({
        "period.end": { $lt: currentDate },
        status: { $in: ["Odobreno", "Odbijeno"] },
      });

      console.log("Expired reservations: ", expiredReservations);

      for (const reservation of expiredReservations) {
        reservation.status = "Završeno";
        await reservation.save();
      }

      console.log("Završena provjera isteka rezervacija.");
    } catch (error) {
      console.error(
        "Greška prilikom provjere isteka rezervacija:",
        error.message
      );
    }
  });
};

module.exports = checkExpiredReservations;
