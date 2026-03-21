// This shows the probability, risk level and AI explanantion
function ResultPanel({ result }) {
    const riskColors = {
        High: "#ef4444",
        Medium: "#f97316",
        Low: "#22c55e",
    };

    const color = riskColors[result.risk_level] || "#gray";

    return (
        <div className="result-panel card">
            <div className="risk-badge" style={{ backgroundColor: color }}>
                {result.risk_level} Risk
            </div>

            <div className="probability">
                <h2>Failure Probability</h2>
                <span className="prob-value">
                    {(result.failure_probability * 100).toFixed(1)}%
                </span>
            </div>

            <div className="Prediction">
                <h2>Prediction</h2>
                <span>{result.prediction}</span>
            </div>

            <div className="explanation">
                <h2>AI Explanation</h2>
                <p>{result.explanation}</p>
            </div>
        </div>
    )
}

export default ResultPanel;