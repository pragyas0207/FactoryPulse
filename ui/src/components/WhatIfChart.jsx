import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function WhatIfChart({ whatif }) {
  return (
    <div className="card">
      <h2>What-If Analysis</h2>
      {whatif.whatif.map((feature) => (
        <div key={feature.feature}>
          <h3>{feature.feature.replace(/_/g, " ")}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={feature.scenarios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="value" />
              <YAxis tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
              <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
              <Line
                type="monotone"
                dataKey="probability"
                stroke="#ef4444"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

export default WhatIfChart;