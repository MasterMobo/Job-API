require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Routers
const auth_routes = require("./routes/auth");
const jobs_routes = require("./routes/jobs");

// Middleware
app.use(express.json());
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler"); // error handler
const authenticateJWT = require("./middleware/authentication");

// extra packages
const connectDB = require("./db/connect");

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

app.use("/api/v1/auth", auth_routes);
app.use("/api/v1/jobs", authenticateJWT, jobs_routes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Sucessfully connected to MongoDB!");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
