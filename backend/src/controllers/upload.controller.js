import Upload from "../models/Upload.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs"

export const getMyUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-file.path");

    res.status(200).json(uploads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
};

export const uploadData = async (req, res) => {
  try {
    const { text, expiry, maxViews, maxDownloads ,sharePassword } = req.body;
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
    let parsedMaxViews;
    let parsedMaxDownloads;

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

    if (maxViews) {
      parsedMaxViews = parseInt(maxViews);
      if (isNaN(parsedMaxViews) || parsedMaxViews <= 0) {
        return res.status(400).json({ message: "Invalid maxViews value" });
      }
    }

    if (maxDownloads) {
      parsedMaxDownloads = parseInt(maxDownloads);
      if (isNaN(parsedMaxDownloads) || parsedMaxDownloads <= 0) {
        return res.status(400).json({ message: "Invalid maxDownloads value" });
      }
    }
    let hashedPassword = null;

    if (sharePassword && sharePassword.trim() !== "") {
      hashedPassword = await bcrypt.hash(sharePassword, 10);
    }
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
      ...(expiresAt && { expiresAt }),
      ...(parsedMaxViews && { maxViews: parsedMaxViews }),
      ...(parsedMaxDownloads && { maxDownloads: parsedMaxDownloads }),
      ...(hashedPassword && {
    sharePassword: hashedPassword,
    isPasswordProtected: true,
  }),

    });
    if (hashedPassword) {
      upload.sharePassword = hashedPassword;
      upload.isPasswordProtected = true;
    }

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

export const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    if (upload.file?.path) {
      const filePath = path.resolve(upload.file.path);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Upload.deleteOne({ _id: upload._id });

    res.status(200).json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
