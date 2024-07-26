// db.js

const mongoose = require("mongoose");
require('dotenv').config({path:__dirname+'/./../../.env'})
const db = process.env.MONGODB_URI;
mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
