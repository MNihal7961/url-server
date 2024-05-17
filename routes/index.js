import express from "express";
import userRouter from "./user.js";


const router = express.Router();

// start with user
router.use('/user', userRouter);

export default router;