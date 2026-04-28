import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../api/axios";

export default function Reports() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get("/reports/category-breakdown");
      setItems(data.map((item) => ({ category: item.category, amount: item.total })));
    }

    load();
  }, []);

  return (
    <section className="panel chart-panel">
      <h3>Category Spending Report</h3>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={items}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
