import express from "express";
import { generateQuiz } from "../controller/quiz.controller.js";

const router = express.Router();

router.post("/quiz", generateQuiz);

export default router;
