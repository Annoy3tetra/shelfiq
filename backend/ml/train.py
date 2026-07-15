import joblib
import pandas as pd

from sklearn.linear_model import LinearRegression

data = {
    "month": [1, 2, 3, 4, 5, 6],
    "sales": [10000, 12000, 14000, 17000, 19000, 22000]
}

df = pd.DataFrame(data)

X = df[["month"]]
y = df["sales"]

model = LinearRegression()

model.fit(X, y)

joblib.dump(
    model,
    "ml/model.pkl"
)

print("Model trained.")