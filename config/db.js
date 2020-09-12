const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("MonogoDB connected");
  } catch (error) {
    console.error(error.message);
    // Exit
    process.exit(1);
  }
};
module.exports = connectDB;
