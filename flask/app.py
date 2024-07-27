from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)

CORS(app)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    number = data.get('number')
    
    if not isinstance(number, (int, float)):
        return bad_request_error("Missing 'number' field.")

    number_array = np.array([[number]])
    prediction = model.predict(number_array)[0]
    rounded_prediction = round(prediction)
    integer_prediction = int(rounded_prediction)
    return jsonify({'prediction': integer_prediction})


@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not Found', 'message': str(error)}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error', 'message': 'An unexpected error occurred.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
