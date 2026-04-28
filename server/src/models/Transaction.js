import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true, maxlength: 300, default: "" },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
