import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultPanel from "./components/ResultPanel";
import ShapChart from "./components/ShapChart";
import WhatIfChart from "./components/WhatIfChart";
import ModelMetrics from "./components/ModelMetrics";

function App() {
  const [result, setResult] = useState(null);
  const [whatif, setWhatif] = useState(null);
  const [loading, setLoading] = useState(null);

  // Call both API endpoints simul with Promise.all
  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const [predRes, whatifRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
        fetch("http://127.0.0.1:8000/whatif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
      ]);

      const predData = await predRes.json();
      const whatifData = await whatifRes.json();

      setResult(predData);
      setWhatif(whatifData);
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  };

  // Components only render after we have data (result &&)
  return (
    <div className="app">
      {/* <h1>Machine Failure Prediction</h1> */}
      <div className="header-left">
        <span className="header-icon">⚙️</span>
        <div>
          <h1>FactoryPulse</h1>
          <p>Predictive Maintenance for Smart Factories</p>
        </div>
      </div>
      <ModelMetrics />
      <InputForm onSubmit={handleSubmit} loading={loading} />
      {result && <ResultPanel result={result} />}
      {result && <ShapChart shap={result.shap_values} />}
      {whatif && <WhatIfChart whatif={whatif} />}
    </div>
  );

}

export default App;