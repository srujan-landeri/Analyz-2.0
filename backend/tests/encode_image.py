from base64 import b64encode
import pyperclip
import os

def encode_image(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(f"The file at {path} does not exist.")

    with open(path, "rb") as file:
        string = b64encode(file.read()).decode('utf-8')
        pyperclip.copy(string)
        print("Encoded string copied to clipboard.")

def load_json(string: str):
    import json
    print(json.loads(string))
    return json.loads(string)

encode_image("tests/temp.png")