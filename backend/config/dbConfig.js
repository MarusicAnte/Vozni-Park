const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/vozniParkBaza", {});
    const db = mongoose.connection;

    db.on("error", (error) => {
      console.error("Greška pri spajanju:", error);
    });

    db.once("open", function () {
      console.log("Spojeni smo na MongoDB bazu");
    });
  } catch (error) {
    console.error("Greška pri spajanju na MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
