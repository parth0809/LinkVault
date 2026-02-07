import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      default: null,
    },

    file: {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      path: String,
    },
     shareToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
     expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Upload", uploadSchema);
