import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadData , getFileByName} from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadData
);
router.get("/uploads/:filename", getFileByName);



export default router;
