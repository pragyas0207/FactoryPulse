const metrics = [
  { label: "ROC-AUC", value: "0.9634", description: "Overall model quality", color: "#22c55e" },
  { label: "Recall", value: "0.7369", description: "Failures correctly caught", color: "#3b82f6" },
  { label: "Precision", value: "0.4403", description: "Accuracy of failure alerts", color: "#f97316" },
  { label: "F1 Score", value: "0.5187", description: "Precision-recall balance", color: "#8b5cf6" },
];

function ModelMetrics() {
  return (
    <div className="card">
      <h2>Model Performance</h2>
      <p className="metrics-note">5-fold cross validation · High recall prioritized to minimize missed failures</p>
      <div className="metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <span className="metric-value" style={{ color: m.color }}>{m.value}</span>
            <span className="metric-label">{m.label}</span>
            <span className="metric-desc">{m.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelMetrics;