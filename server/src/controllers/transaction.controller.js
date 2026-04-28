import { z } from "zod";
import { Transaction } from "../models/Transaction.js";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  category: z.string().min(1).max(50),
  note: z.string().max(300).optional().default(""),
  date: z.string()
});

export async function listTransactions(req, res, next) {
  try {
    const items = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
      createdAt: -1
    });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const data = transactionSchema.parse({
      ...req.body,
      amount: Number(req.body.amount)
    });

    const created = await Transaction.create({
      ...data,
      userId: req.user.id,
      date: new Date(data.date)
    });

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function updateTransaction(req, res, next) {
  try {
    const raw = req.body || {};
    const update = {
      ...(raw.type ? { type: raw.type } : {}),
      ...(raw.amount !== undefined ? { amount: Number(raw.amount) } : {}),
      ...(raw.category ? { category: raw.category } : {}),
      ...(raw.note !== undefined ? { note: raw.note } : {}),
      ...(raw.date ? { date: new Date(raw.date) } : {})
    };

    const item = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

export async function deleteTransaction(req, res, next) {
  try {
    const item = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
}
