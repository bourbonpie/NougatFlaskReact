from flask import Flask, json, request, jsonify
from flask_cors import CORS
import subprocess
import time
import requests

import openai
import urllib.request
from werkzeug.utils import secure_filename
import os
import multiprocessing

app = Flask(__name__)
CORS(app)

command = 'nougat_api'
url = 'http://127.0.0.1:8503/predict/'

nougat_process = None
nougat_response = None

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Check if file is right format, PDF
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

# Run the auto Nougat script
def run_nougat_process(file_path):
    global nougat_response
    
    try:
        payload = {'file': (file_path, open(file_path, 'rb'), 'application/pdf')}
        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        time.sleep(16)

        while True:
            output_line = process.stdout.readline().decode('utf-8')
            print("Received output: ", output_line, end='')

            if "Uvicorn running on http://127.0.0.1:8503" in output_line:
                print("Found the expected message in output.")
                print(output_line, end='', flush=True)

                response = requests.post(url, files=payload)
                ocr_result = response.text
        
                print(ocr_result)
                
                nougat_response = ocr_result
                
                if process.poll() is None:
                    print("Terminating Nougat server...")
                    process.wait()  # Wait for the process to finish
                    process.terminate()

                break

    except Exception as e:
        print(str(e))

# Receive image path from client, store this and show to GPT
@app.route('/upload_image_path', methods=['POST', 'GET'])
def trigger_nougat():
    global nougat_success
    global nougat_response
    
    if 'files[]' not in request.files:
        resp = jsonify({
            "message": "No file part in request",
            "status": "failed",
        })
        resp.status_code = 400
        return resp

    files = request.files.getlist('files[]')
    print(files)

    file_paths = []
    nougat_success = False

    # Iterate through files and check if: A) it exists, and B) it is allowed
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            # Add filename to our /upload folder in /static directory
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            file.save(file_path)
            file_paths.append(file_path)

            # Start the Nougat process in a separate process
            nougat_process = multiprocessing.Process(target=run_nougat_process, args=(file_path,))
            nougat_process.start()
            nougat_process.join()

            nougat_success = True

        # If not true, display fail message
        else:
            resp = jsonify({
                'message': 'File type is not allowed',
                'status': 'Failure'
            })
            return resp

    if nougat_success:
        
        # FILE SUCCESS
        resp = jsonify({
            "message": "Files successfully uploaded",
            "status": "success",
            "file_paths": file_paths,
            "nougat_response": nougat_response
        })
        resp.status_code = 201
        return resp

    return resp
        
if __name__ == '__main__':
    app.run(debug=True, port=3400)
