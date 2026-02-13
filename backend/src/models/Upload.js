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
      default: function () {
        return new Date(Date.now() + 10 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

uploadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Upload", uploadSchema);
