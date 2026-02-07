
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js"
import cookieParser from "cookie-parser";
import shareRoutes from "./src/routes/share.route.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/",uploadRoutes);
app.use("/", shareRoutes);


export default app;
