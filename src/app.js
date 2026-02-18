const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { CLIENT_URL, NODE_ENV } = require("./config/env");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorMiddleware = require("./middleware/errorMiddleware");

// Route imports
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// ── Global Middleware ──
app.use(helmet());

// during development we simply reflect the request origin so it's
// always allowed; in production you should replace this with a stricter
// whitelist or specific URL from an environment variable.
app.use(
  cors({
    origin: true, // mirror request origin
    credentials: true,
  }),
);

// app.use(
//   cors({
//     origin: CLIENT_URL,
//     credentials: true,
//   }),
// );
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generalLimiter);

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health Check ──
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy 🚀" });
});

// ── API Routes ──
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/upload", uploadRoutes);

// ── 404 Handler ──
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──
app.use(errorMiddleware);

module.exports = app;
