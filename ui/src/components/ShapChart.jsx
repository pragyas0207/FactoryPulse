import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

function ShapChart({ shap }) {
  const data = Object.entries(shap)
    .map(([key, value]) => ({
      feature: key.replace("num__", "").replace("cat__", ""),
      value: parseFloat(value.toFixed(4)),
    }))
    .sort((a, b) => b.value - a.value);

    return (
    <div className="card">
      <h2>Feature Impact (SHAP)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="feature" width={150} />
          <Tooltip />
          <ReferenceLine x={0} stroke="#000" />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

}

export default ShapChart;