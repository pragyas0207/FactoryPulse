# FactoryPulse — Predictive Maintenance for Smart Factories

FactoryPulse is an end-to-end predictive maintenance system that uses machine learning to predict equipment failures before they happen. Built on the AI4I dataset, it combines XGBoost predictions with SHAP explainability, what-if scenario analysis, and a React dashboard for real-time monitoring.

## Live Demo
- Frontend: `coming soon`
- Backend API: `coming soon`

## Screenshots
<img width="2304" height="1200" alt="image" src="https://github.com/user-attachments/assets/05deeabb-b1e4-4547-b8e3-7aa5813bebe6" />

<img width="2195" height="1724" alt="image" src="https://github.com/user-attachments/assets/cf8c177f-0272-49d3-b29f-7b3a5c1d7147" />

<img width="2060" height="1724" alt="image" src="https://github.com/user-attachments/assets/28cd0590-25b5-4e14-92af-1ae9df11c291" />


## Features
- Machine failure probability prediction using XGBoost
- SHAP-based feature importance visualization
- What-if scenario analysis for key machine parameters
- AI-generated natural language explanations per prediction
- Model performance metrics (ROC-AUC: 0.96, Recall: 0.74)
- REST API built with FastAPI

## Tech Stack
**Backend:** FastAPI, XGBoost, SHAP, Scikit-learn, Groq LLM  
**Frontend:** React, Recharts, Vite  
**Deployment:** Render (API), Vercel (UI)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Returns failure probability, SHAP values, AI explanation |
| POST | `/whatif` | Returns probability across feature value scenarios |

## Running Locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd ui
npm install
npm run dev
```

## Model Performance
Evaluated using 5-fold cross validation on the AI4I Predictive Maintenance dataset.

| Metric | Score |
|--------|-------|
| ROC-AUC | 0.9634 |
| Recall | 0.7369 |
| Precision | 0.4403 |
| F1 Score | 0.5187 |

High recall is prioritized to minimize missed failures in production environments.

## Dataset
[AI4I 2020 Predictive Maintenance Dataset](https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset) — UCI Machine Learning Repository
