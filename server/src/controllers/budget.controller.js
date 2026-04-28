import { z } from "zod";
import { Budget } from "../models/Budget.js";
import { Transaction } from "../models/Transaction.js";

const budgetSchema = z.object({
  category: z.string().min(1).max(50),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  limit: z.number().nonnegative()
});

export async function listBudgets(req, res, next) {
  try {
    const filter = { userId: req.user.id };
    if (req.query.month) filter.month = req.query.month;

    const budgets = await Budget.find(filter).sort({ category: 1 });

    const items = await Promise.all(
      budgets.map(async (budget) => {
        const [year, month] = budget.month.split("-").map(Number);
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const spentAgg = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              type: "expense",
              category: budget.category,
              date: { $gte: start, $lt: end }
            }
          },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const spent = spentAgg[0]?.total || 0;
        return {
          ...budget.toObject(),
          spent,
          remaining: Math.max(0, budget.limit - spent),
          exceeded: spent > budget.limit
        };
      })
    );

    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

export async function createBudget(req, res, next) {
  try {
    const data = budgetSchema.parse({
      ...req.body,
      limit: Number(req.body.limit)
    });

    const created = await Budget.create({
      ...data,
      userId: req.user.id
    });

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function updateBudget(req, res, next) {
  try {
    const raw = req.body || {};
    const update = {
      ...(raw.category ? { category: raw.category } : {}),
      ...(raw.month ? { month: raw.month } : {}),
      ...(raw.limit !== undefined ? { limit: Number(raw.limit) } : {})
    };

    const item = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

export async function deleteBudget(req, res, next) {
  try {
    const item = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({ message: "Budget not found" });
    }

    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
}
