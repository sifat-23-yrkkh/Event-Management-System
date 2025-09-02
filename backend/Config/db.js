const mongoose = require("mongoose");

const connectToDatabase = () => {
  const mongo_url = process.env.MONGO_CONN;

  return mongoose
    .connect(mongo_url)
    .then(() => {
      console.log("Mongodb Connected");
    })
    .catch((err) => {
      console.log("Mongodb Connection Error:", err);
    });
};

module.exports = connectToDatabase;