const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Import routes
const userRouter = require("./src/routers/userRouter");

// Routes
app.use("/api/v1", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Bistro Boss Server",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
