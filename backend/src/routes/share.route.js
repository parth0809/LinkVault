import express from "express";
import { getSharedUpload , downloadSharedFile ,unlockSharedUpload , unlockAndDownloadFile} from "../controllers/shareController.js";

const router = express.Router();
router.get("/share/:token/download", downloadSharedFile);
router.post("/share/:token/download/unlock", unlockAndDownloadFile);
router.post("/share/:token/unlock", unlockSharedUpload);
router.get("/share/:token", getSharedUpload);



export default router;
