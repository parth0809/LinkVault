import express from "express";
import { getSharedUpload } from "../controllers/shareController.js";

const router = express.Router();

router.get("/share/:token", getSharedUpload);

export default router;
