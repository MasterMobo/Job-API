require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// extra packages
const connectDB = require("./db/connect");
// Security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// Routers
const auth_routes = require("./routes/auth");
const jobs_routes = require("./routes/jobs");

// Middleware
app.set("trust proxy", 1); // App is behind a proxy balancer (Heroku, Bluemix, AWS ELB,...)
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests every windowMS
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler"); // error handler
const authenticateJWT = require("./middleware/authentication");

// routes
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
