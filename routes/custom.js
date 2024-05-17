import express from "express";
import { custom15url, get15url ,delete15,delete1} from "../controllers/customcontroller.js";


const router = express.Router();

router.get('/', custom15url)
router.get('/mycustom15', get15url)
router.put('/:urlCode', delete15)
router.put('/remove1/:urlCode', delete1)

export default router;