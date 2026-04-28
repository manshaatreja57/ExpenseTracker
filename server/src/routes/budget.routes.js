import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget
} from "../controllers/budget.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(auth);
router.get("/", listBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
