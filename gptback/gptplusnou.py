import openai
import os
import requests
from flask import Flask
from flask_cors import CORS

nougat_url = 'http://127.0.0.1:3400/fetch_response'


openai.api_key = "sk-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"
os.environ["OPEN_API_KEY"]="sk-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"

app = Flask(__name__)
CORS(app)

def fetch_nougat_response():
    response = requests.get(nougat_url)
    if response.status_code==201:
        nougat_response = response.json().get('nougat_response')
        print("HE HAS ARRIVED: \n", nougat_response)
    else:
        print("WHERE IS NOUGAT?\n", response.status_code)
    
    
@app.route('/upload_image_path', methods=['GET'])
def reactMeetNougat():
    heSpeaks = fetch_nougat_response()
    parsed =[]
    parsed.append(heSpeaks)
    converse = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=parsed   
    )
    print(converse['choices'][0]['message']['content'])
    
if __name__ == "__main__":
    app.run(debug=True, port=3500)
