import cron from "node-cron";
import Upload from "../models/Upload.js";
import fs from "fs";

cron.schedule("*/1 * * * *", async () => {
  const expired = await Upload.find({
    expiresAt: { $lt: new Date() }
  });

  for (const item of expired) {
    if (item.file?.path && fs.existsSync(item.file.path)) {
      fs.unlinkSync(item.file.path);
    }

    await Upload.deleteOne({ _id: item._id });
  }
});
