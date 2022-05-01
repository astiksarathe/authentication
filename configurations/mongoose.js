const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Kalpana01:M0PQQCbQfyKIYNy9@cluster0.binzk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then((resolve) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Can not connect to database :", err);
  });

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB is disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close();
  process.exit(0);
});
