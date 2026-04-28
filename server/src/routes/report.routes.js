import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { categoryBreakdown, summary } from "../controllers/report.controller.js";

const router = Router();

router.use(auth);
router.get("/summary", summary);
router.get("/category-breakdown", categoryBreakdown);

export default router;
