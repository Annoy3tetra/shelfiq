import joblib

model = joblib.load(
    "ml/model.pkl"
)


def predict_sales(month: int):

    prediction = model.predict(
        [[month]]
    )

    return float(
        prediction[0]
    )