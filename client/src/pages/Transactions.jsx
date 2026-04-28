import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const initialForm = {
  type: "expense",
  amount: "",
  category: "",
  note: "",
  date: new Date().toISOString().slice(0, 10)
};

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);

  async function load() {
    const { data } = await api.get("/transactions");
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.post("/transactions", {
        ...form,
        amount: Number(form.amount)
      });
      setForm(initialForm);
      await load();
      toast.success("Transaction added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add transaction");
    }
  }

  async function handleDelete(id) {
    await api.delete(`/transactions/${id}`);
    await load();
  }

  return (
    <div className="two-column-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h3>Add Transaction</h3>
        <select
          value={form.type}
          onChange={(event) => setForm({ ...form, type: event.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: event.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        />
        <input
          placeholder="Note"
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(event) => setForm({ ...form, date: event.target.value })}
        />
        <button className="primary-button" type="submit">
          Save
        </button>
      </form>

      <section className="panel">
        <h3>Transaction History</h3>
        <div className="list">
          {items.length === 0 && <p className="muted-text">No transactions yet.</p>}
          {items.map((item) => (
            <article className="list-item" key={item._id}>
              <div>
                <strong>
                  {item.category} · {item.type}
                </strong>
                <div className="muted-text">
                  {new Date(item.date).toLocaleDateString()} · {item.note || "No note"}
                </div>
              </div>
              <div className="list-item-actions">
                <span className={item.type === "income" ? "amount-positive" : "amount-negative"}>
                  ${item.amount.toFixed(2)}
                </span>
                <button className="ghost-danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
