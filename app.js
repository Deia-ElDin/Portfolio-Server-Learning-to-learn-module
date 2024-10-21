require("dotenv").config();
require("express-async-errors");
// App
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
// Security
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
// Database
const connectDB = require("./db/connectDB");
// Cookies
const cookieParser = require("cookie-parser");
// Middleware
const logger = require("./middleware/logger");
const credentials = require("./middleware/credentials");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
// Routes
const authRouter = require("./routes/auth");
const skillsRouter = require("./routes/skills");
const jobsRouter = require("./routes/jobs");
const projectsRouter = require("./routes/projects");
const profileRouter = require("./routes/profile");
const contactRouter = require("./routes/contacts");
const socialMediaRouter = require("./routes/socialMedia");

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/skills", skillsRouter);
app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/medias", socialMediaRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected to db");

    app.listen(PORT, () => {
      console.log(`Server is up & , ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
