import express from "express";
import { custom15url, get15url ,delete15} from "../controllers/customcontroller.js";


const router = express.Router();

router.get('/', custom15url)
router.get('/mycustom15', get15url)
router.put('/:urlCode', delete15)

export default router;