from flask import Flask, request, render_template, send_file
import pandas as pd
from validate import process_csv
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    if file:
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)
        df = process_csv(file_path)
        output_path = os.path.join('uploads', 'validated_' + file.filename)
        df.to_csv(output_path, index=False)
        return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)


