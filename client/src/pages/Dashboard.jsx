import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import api from "../api/axios";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];

export default function Dashboard() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    async function load() {
      const [summaryResponse, breakdownResponse] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/reports/category-breakdown")
      ]);

      setSummary(summaryResponse.data);
      setBreakdown(
        breakdownResponse.data.map((item) => ({
          name: item.category,
          value: item.total
        }))
      );
    }

    load();
  }, []);

  return (
    <div className="dashboard-grid">
      <div className="stat-card">
        <p>Total Income</p>
        <h2>${summary.income.toFixed(2)}</h2>
      </div>
      <div className="stat-card">
        <p>Total Expense</p>
        <h2>${summary.expense.toFixed(2)}</h2>
      </div>
      <div className="stat-card">
        <p>Net Balance</p>
        <h2>${summary.balance.toFixed(2)}</h2>
      </div>

      <div className="panel chart-panel">
        <h3>Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={breakdown} dataKey="value" nameKey="name" outerRadius={110} label>
              {breakdown.map((item, index) => (
                <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
