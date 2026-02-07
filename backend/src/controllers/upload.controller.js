import Upload from "../models/Upload.js";

export const uploadData = async (req, res) => {
  const { text } = req.body;
  const file = req.file;
  if (!text && !file) {
    return res.status(400).json({
      message: "Either text or file is required",
    });
  }

  if (text && file) {
    return res.status(400).json({
      message: "Provide either text OR file, not both",
    });
  }

  const upload = await Upload.create({
    user: req.userId,
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
  });

  res.status(201).json({
    message: "Upload successful",
    uploadId: upload._id,
  });
};
