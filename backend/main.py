from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import shap
import os
from dotenv import load_dotenv
# BaseModel defines the shape of incoming user request
# Pydantic model describes what input API expects

app=FastAPI(title="Machine Failure Prediction API")

# Allows UI to talk to API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Loads pipeline once server starts
model=joblib.load(r"D:\ML\Predictive Maintenance for Smart Factories\maintenance_model.pkl")


# Include SHAP explainability
# Our model is XGB pipeline but SHAP needs raw XGB
xgb_model = model.named_steps["model"]
preprocessor = model.named_steps["preprocessor"]
explainer = shap.TreeExplainer(xgb_model)


# Input Schema
class MachineInput(BaseModel):
    Type:str
    Air_temperature_K:float
    Process_temperature_K:float
    Rotational_speed_rpm:int
    Torque_Nm:float
    Tool_wear_min:int

# To replace the API-friendly field names back to exact col names your model was trained on
def prepare_input(data: MachineInput) -> pd.DataFrame:
    df = pd.DataFrame([data.model_dump()])
    df["Temp_Diff"] = df["Process_temperature_K"] - df["Air_temperature_K"]
    df = df.rename(columns={
        "Air_temperature_K": "Air temperature [K]",
        "Process_temperature_K": "Process temperature [K]",
        "Rotational_speed_rpm": "Rotational speed [rpm]",
        "Torque_Nm": "Torque [Nm]",
        "Tool_wear_min": "Tool wear [min]"
    })
    return df

# Now, natural language explanations
import httpx

async def generate_explanation(prob:float,risk_level:str,shap_dict:dict,data: MachineInput)->str:
    prompt=f"""
    You are a predictive maintenance expert. Explain this machine health prediction in simple, actionable language.
    Machine Reading:
    - Type: {data.Type}
    - Air Temperature: {data.Air_temperature_K} K
    - Process Temperature: {data.Process_temperature_K} K
    - Rotational Speed: {data.Rotational_speed_rpm} rpm
    - Torque: {data.Torque_Nm} Nm
    - Tool Wear: {data.Tool_wear_min} min

    Prediction: {risk_level} risk of failure ({round(prob*100,1)}%probability)

    SHAP feature impacts (negative= reduces failure risk, positive= increases it): {shap_dict}

    Give a 3-4 sentence explanation covering:
    1. Overall machine health status
    2. Which features are most responsible and why
    3. What action the technician should take
    Keep it concise and non-technical
    """

    async with httpx.AsyncClient() as client:
        GROQ_API_KEY=os.getenv("GROQ_API_KEY")
        response=await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization":f"Bearer {GROQ_API_KEY}",
                "content-type":"application/json"
            },
            json={
                "model":"llama-3.3-70b-versatile",
                "max_tokens":300,
                "messages":[{"role":"user","content":prompt}]
            }
        )

    return response.json()["choices"][0]["message"]["content"]
    # print(response.json)
    # result = response.json()
    # print(result)
    # raise Exception(str(result))




# @app.get("/")
# def hello():
#     return({
#         "msg":"Hello"
#     }
#     )


@app.post("/predict")
async def predict(data: MachineInput):
    df=prepare_input(data)

    prob=model.predict_proba(df)[0][1]
    prediction=int(model.predict(df)[0])

    transformed=preprocessor.transform(df)
    shap_values=explainer.shap_values(transformed)

    feature_names=(
        model.named_steps["preprocessor"].get_feature_names_out().tolist()
    )

    shap_dict=dict(zip(feature_names,shap_values[0].tolist()))
    risk_level= "High" if prob>0.7 else "Medium" if prob>0.4 else "Low",

    explanation = await generate_explanation(prob, risk_level, shap_dict, data)
    # explanation="test"
    return{
        "failure_probability":round(float(prob),4),
        "prediction":"Failure" if prediction ==1 else "No Failure",
        "risk_level":risk_level,
        "shap_values":shap_dict,
        "explanation":explanation
    }

# what if scenario
@app.post("/whatif")
async def whatif(data: MachineInput):
    results = []
    
    base_df = prepare_input(data)
    base_prob = float(model.predict_proba(base_df)[0][1])
    
    scenarios = {
        "Tool_wear_min": [50, 100, 150, 200, 250],
        "Torque_Nm": [20, 30, 40, 50, 60],
        "Rotational_speed_rpm": [1200, 1500, 1800, 2100, 2500]
    }
    
    for feature, values in scenarios.items():
        feature_results = []
        for val in values:
            modified = data.model_copy(update={feature: val})
            df = prepare_input(modified)
            prob = float(model.predict_proba(df)[0][1])
            feature_results.append({"value": val, "probability": round(prob, 4)})
        results.append({"feature": feature, "scenarios": feature_results})
    
    return {"base_probability": round(base_prob, 4), "whatif": results}
