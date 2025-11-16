import { Router } from "express";
import { reconocerRostro } from "../controllers/reconocimiento_controller.js";

const router = Router();

router.post("/reconocer", reconocerRostro);

export default router;
