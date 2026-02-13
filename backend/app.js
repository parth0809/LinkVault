
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js"
import cookieParser from "cookie-parser";
import shareRoutes from "./src/routes/share.route.js";
import "./src/jobs/cron.jobs.js"

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowed =
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

    callback(null, allowed);
  },
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use("/", authRoutes);
app.use("/",uploadRoutes);
app.use("/", shareRoutes);


export default app;
