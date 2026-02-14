import Upload from "../models/Upload.js";
import bcrypt from "bcrypt"

export const getSharedUpload = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(403).json({ error: "Invalid access link" });
  }

  const upload = await Upload.findOne({ shareToken: token }).select("-user");

  if (!upload) {
    return res.status(403).json({ message: "Link not found" });
  }
  if (upload.expiresAt && upload.expiresAt <= new Date()) {
    return res.status(410).json({
      message: "This link has expired"
    });
  }
if (upload.isPasswordProtected) {
  return res.status(200).json({
    requiresPassword: true,
    type: upload.file ? "file" : "text"
  });
}


  if (upload.text) {
    if (upload.currentViews / 2 >= upload.maxViews) {
      return res.status(410).json({
        message: "Maximum views reached"
      });
    }

    upload.currentViews += 1;
    await upload.save();

  }
  return res.status(200).json(upload);
};


export const unlockSharedUpload = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const upload = await Upload.findOne({ shareToken: token }).select("-user");

  if (!upload) {
    return res.status(404).json({ message: "Link not found" });
  }

  if (!upload.isPasswordProtected) {
    return res.status(400).json({
      message: "This link does not require password"
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required"
    });
  }

  const isMatch = await bcrypt.compare(password, upload.sharePassword);

  if (!isMatch) {
    return res.status(401).json({
      message: "Incorrect password"
    });
  }



  if (upload.text) {
    if (upload.maxViews && upload.currentViews >= upload.maxViews) {
      return res.status(410).json({
        message: "Maximum views reached"
      });
    }

    upload.currentViews += 2;
    await upload.save();
  }

  return res.status(200).json(upload);
};


export const downloadSharedFile = async (req, res) => {
  try {
    const { token } = req.params;


    if (!token) {
      return res.status(400).json({ message: "Invalid link" });
    }
    const upload = await Upload.findOne({ shareToken: token });
    if (!upload) {
      return res.status(403).json({ message: "Link not found" });
    }
    if (upload.expiresAt && upload.expiresAt <= new Date()) {
      return res.status(410).json({ message: "Link expired" });
    }
    if (!upload.file) {
      return res.status(400).json({ message: "No file attached" });
    }

    if (upload.isPasswordProtected) {
      return res.status(200).json({
        requiresPassword: true, 
        type: "file"
      });
    }

    if (upload.currentDownloads >= upload.maxDownloads) {
      return res.status(410).json({
        message: "Maximum downloads reached"
      });
    }
    upload.currentDownloads += 1;
    await upload.save();

    return res.download(upload.file.path, upload.file.originalName);

  } catch (error) {
    console.error("Download Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const unlockAndDownloadFile = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const upload = await Upload.findOne({ shareToken: token });

    if (!upload || !upload.file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!upload.isPasswordProtected) {
      return res.status(400).json({
        message: "This file does not require password"
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password required"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      upload.sharePassword
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    if (
      upload.maxDownloads &&
      upload.currentDownloads >= upload.maxDownloads
    ) {
      return res.status(410).json({
        message: "Maximum downloads reached"
      });
    }
    if (!upload || !upload.file || !upload.file.path) {
  return res.status(404).json({ message: "File not found" });
}

    upload.currentDownloads += 1;
    await upload.save();
    
 return res.download(upload.file.path, upload.file.originalName);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
