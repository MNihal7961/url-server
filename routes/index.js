import express from "express";
import userRouter from "./user.js";
import urlRouter from './url.js'
import customRouter from './custom.js'

const router = express.Router();

// start with user
router.use('/user', userRouter);
router.use('/url', urlRouter);
router.use('/custom', customRouter);

export default router;