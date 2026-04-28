import { Transaction } from "../models/Transaction.js";

export async function summary(req, res, next) {
  try {
    const agg = await Transaction.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const income = agg.find((item) => item._id === "income")?.total || 0;
    const expense = agg.find((item) => item._id === "expense")?.total || 0;

    return res.json({
      income,
      expense,
      balance: income - expense
    });
  } catch (err) {
    return next(err);
  }
}

export async function categoryBreakdown(req, res, next) {
  try {
    const items = await Transaction.aggregate([
      { $match: { userId: req.user.id, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    return res.json(items.map((item) => ({ category: item._id, total: item.total })));
  } catch (err) {
    return next(err);
  }
}
