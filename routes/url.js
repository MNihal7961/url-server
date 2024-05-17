import express from 'express';

import { createUrlPost, fetchAllUrlsByUserGet, redirectByUrlCodeGet, deleteUrlCodePut } from '../controllers/urlcontroller.js';

const router = express.Router();

router.post("/", createUrlPost);
router.get("/myurls", fetchAllUrlsByUserGet);
router.get("/:urlCode", redirectByUrlCodeGet);
router.put("/:urlCode", deleteUrlCodePut);

export default router;


