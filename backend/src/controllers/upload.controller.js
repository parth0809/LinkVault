import Upload from "../models/Upload.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";


export const uploadData = async (req, res) => {
  try {
    const { text, expiry } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res.status(400).json({ message: "Either text or file is required" });
    }

    if (text && file) {
      return res.status(400).json({
        message: "Provide either text OR file, not both"
      });
    }

    const shareToken = crypto.randomBytes(16).toString("hex");

    let expiresAt;

    if (typeof expiry === "string" && expiry.length > 0) {
      const customExpiry = new Date(expiry);

      if (isNaN(customExpiry.getTime())) {
        return res.status(400).json({ message: "Invalid expiry date" });
      }

      if (customExpiry <= new Date()) {
        return res.status(400).json({
          message: "Expiry must be in the future"
        });
      }

      expiresAt = customExpiry;
    }

    const upload = await Upload.create({
      user:  req.user.userId,
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
      ...(expiresAt && { expiresAt })
    });

    res.status(200).json({
      message: "Upload successful",
      link: `/share/${shareToken}`,
      expiresAt: upload.expiresAt,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error" });
  }
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