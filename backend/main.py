from fastapi import FastAPI, HTTPException
from fmp_python.fmp import FMP
import os
from dotenv import load_dotenv
import pandas as pd
import requests
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

API_KEY = os.getenv("FMP_API_KEY")
print("API KEY:", API_KEY)
fmp = FMP(api_key=API_KEY, output_format='pandas')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/metrics/{symbol}")
def get_metrics(symbol: str, period: str = 'quarter', limit: int = 4):
    print(f"Fetching financial data for {symbol}...")

    income_url = f"https://financialmodelingprep.com/api/v3/income-statement/{symbol}?limit={limit}&apikey={API_KEY}"
    metrics_url = f"https://financialmodelingprep.com/api/v3/key-metrics/{symbol}?limit={limit}&apikey={API_KEY}"

    income_res = requests.get(income_url)
    metrics_res = requests.get(metrics_url)

    if income_res.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch income statement")
    if metrics_res.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch key metrics")

    income_data = income_res.json()
    metrics_data = metrics_res.json()

    if not income_data or isinstance(income_data, dict) and income_data.get("error"):
        raise HTTPException(status_code=404, detail="Symbol not found or income API error")
    if not metrics_data or isinstance(metrics_data, dict) and metrics_data.get("error"):
        raise HTTPException(status_code=404, detail="Symbol not found or metrics API error")

    # Optional: merge netIncome into income entries by date
    metrics_by_date = {entry['date']: entry for entry in metrics_data}
    for entry in income_data:
        date = entry['date']
        net_income = metrics_by_date.get(date, {}).get('netIncome')
        if net_income is not None:
            entry['netIncome'] = net_income
    print(income_data)
    return {
        "symbol": symbol,
        "income": income_data  # now includes revenue + netIncome
    }
