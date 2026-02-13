import Upload from "../models/Upload.js";

export const getSharedUpload = async (req, res) => {
  const { token } = req.params;
   if (!token) {
      return res.status(403).json({ error: "Invalid access link" });
    }
  const upload = await Upload.findOne({
    shareToken: token,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  }).select("-user"); 
  if (!upload) {
    return res.status(403).json({ message: "Link invalid or expired" });
  }
  
  res.status(200).json(upload);
};
