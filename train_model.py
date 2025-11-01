import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# ✅ Load the Kaggle training dataset
df = pd.read_csv("Training.csv")

# ✅ Identify target column (it may be 'prognosis' or 'disease')
target_col = "prognosis" if "prognosis" in df.columns else "disease"

# ✅ Split features and target
X = df.drop(columns=[target_col])
y = df[target_col]

# ✅ Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ✅ Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Save the model for Flask to load later
with open("disease_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved successfully as disease_model.pkl")
