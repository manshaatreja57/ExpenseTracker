import { useEffect, useState } from "react";
import api from "../api/axios";

const defaultMonth = new Date().toISOString().slice(0, 7);

export default function Budgets() {
  const [month, setMonth] = useState(defaultMonth);
  const [form, setForm] = useState({ category: "", limit: "" });
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await api.get("/budgets", { params: { month } });
    setItems(data);
  }

  useEffect(() => {
    load();
  }, [month]);

  async function handleSubmit(event) {
    event.preventDefault();
    await api.post("/budgets", {
      category: form.category,
      month,
      limit: Number(form.limit)
    });
    setForm({ category: "", limit: "" });
    await load();
  }

  return (
    <div className="two-column-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h3>Set Budget</h3>
        <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        />
        <input
          type="number"
          placeholder="Limit"
          value={form.limit}
          onChange={(event) => setForm({ ...form, limit: event.target.value })}
        />
        <button className="primary-button" type="submit">
          Save Budget
        </button>
      </form>

      <section className="panel">
        <h3>Budgets for {month}</h3>
        <div className="list">
          {items.length === 0 && <p className="muted-text">No budgets found for this month.</p>}
          {items.map((item) => {
            const percent = Math.min(100, ((item.spent || 0) / item.limit) * 100 || 0);
            return (
              <article className="budget-item" key={item._id}>
                <div className="budget-head">
                  <strong>{item.category}</strong>
                  <span className={item.exceeded ? "amount-negative" : ""}>
                    ${item.spent.toFixed(2)} / ${item.limit.toFixed(2)}
                  </span>
                </div>
                <div className="budget-bar">
                  <div
                    className={item.exceeded ? "budget-fill budget-fill-danger" : "budget-fill"}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
