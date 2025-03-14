from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Load the trained model
model = joblib.load('parking_model_rm.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    # Convert JSON data to DataFrame
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return jsonify({'discount_rate': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)