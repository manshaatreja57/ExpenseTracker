import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction
} from "../controllers/transaction.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(auth);
router.get("/", listTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
