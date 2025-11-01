from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ✅ allow frontend calls from different origin

# ✅ Load model safely
try:
    model = pickle.load(open("disease_model.pkl", "rb"))
except Exception as e:
    raise RuntimeError("❌ Model file not found. Run train_model.py first.") from e

# ✅ Load symptom columns from training data
df = pd.read_csv("Training.csv")
if "prognosis" in df.columns:
    cols = df.drop(columns=["prognosis"]).columns
elif "disease" in df.columns:
    cols = df.drop(columns=["disease"]).columns
else:
    raise KeyError("❌ No 'prognosis' or 'disease' column found in Training.csv")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        symptoms = data.get("symptoms", [])

        if not symptoms:
            return jsonify({"error": "No symptoms provided"}), 400

        # ✅ Normalize input (lowercase + strip)
        symptoms = [s.strip().lower().replace(" ", "_") for s in symptoms]

        # ✅ Build input vector (1 = present symptom)
        input_data = [1 if col in symptoms else 0 for col in cols]

        # ✅ Predict using model
        pred = model.predict([input_data])[0]

        return jsonify({
            "predicted_disease": pred,
            "input_symptoms": symptoms,
            "message": "AI diagnosis complete"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
