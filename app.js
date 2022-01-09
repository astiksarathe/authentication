const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const dotenv = require("dotenv").config();
require("./configurations/mongoose");

//routes
const authRoute = require("./routes/authRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoute);

app.get("/", (req, res) => {
  res.send("Server is listening");
});

app.use(async (req, res, next) => {
  next(createError.NotFound("The route does not exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server is listening on the port" + PORT);
});
