import "dotenv/config";
import Debug from "debug";
import express from "express";
import cors from "cors";
import { PORT } from "./env.js";
import helmet from "helmet";
import morgan from "morgan";
import type { ErrorRequestHandler } from "express";

const debug = Debug("myapp");
const app = express();

//Middleware
app.use(morgan("dev", { immediate: false }));
app.use(helmet());
app.use(
  cors({
    origin: false, // Disable CORS
    // origin: "*", // Allow all origins
  })
);
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

// Serving built frontend
app.use(express.static("public"));

// Catch all endpoints
app.use(async (req, res, next) => {
  res.sendFile("index.html", { root: "public" });
});

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  debug(err.message);
  const errorResponse = {
    message: err.message || "Internal Server Error",
    type: err.name || "Error",
    stack: err.stack,
  };
  res.status(500).send(errorResponse);
};
app.use(jsonErrorHandler);

// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
