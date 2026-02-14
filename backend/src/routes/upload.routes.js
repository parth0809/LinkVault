import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadData ,deleteUpload ,getMyUploads } from "../controllers/upload.controller.js";
import multer from "multer";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 50MB."
          });
        }
      } else if (err) {
        return res.status(400).json({
          message: err.message
        });
      }
      next();
    });
  },
  uploadData
);
router.get("/my-uploads", authMiddleware, getMyUploads);
router.delete("/upload/:id", authMiddleware, deleteUpload);




export default router;
