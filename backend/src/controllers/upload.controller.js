import Upload from "../models/Upload.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";


export const uploadData = async (req, res) => {
  const { text } = req.body;
  const file = req.file;

  if (!text && !file) {
    return res.status(400).json({ message: "Either text or file is required" });
  }

  if (text && file) {
    return res.status(400).json({ message: "Provide either text OR file, not both" });
  }

  const shareToken = crypto.randomBytes(16).toString("hex");

  const upload = await Upload.create({
    user: req.user.userId,
    text: text || null,
    file: file
      ? {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
        }
      : null,
    shareToken,
    expiresAt: null, 
  });

  res.status(200).json({
    message: "Upload successful",
    link: `/share/${shareToken}`,
  });
};


export const getFileByName = (req, res) => {
  const { filename } = req.params;

  const uploadDir = path.resolve("uploads");
  const filePath = path.join(uploadDir, filename);

  if (!filePath.startsWith(uploadDir)) {
    return res.status(400).json({ message: "Invalid filename" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath); 
};