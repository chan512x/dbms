import requests as r
from sys import argv, exit
from base64 import b64encode
import json

def get_auth_key():
    headers = {}
    client_id = ""
    client_secret = ""
    with open("client_id.txt", "r") as infile:
        client_id = infile.read()
        client_id = client_id[ 0 : len(client_id) ]
    with open("client_secret.txt", "r") as infile:
        client_secret = infile.read()
        client_secret = client_secret[ 0 : len(client_secret) ]
    client_str = f"{client_id}:{client_secret}"
    client_str_bytes = client_str.encode('ascii')
    client_str = b64encode( client_str_bytes ) 
    client_str = client_str.decode('ascii')
    auth_header = f"Basic {client_str}"
    headers['Authorization'] = auth_header
    data = {
        "grant_type" : "client_credentials"
    }
    url = "https://accounts.spotify.com/api/token"
    myreq = r.post(url, headers=headers, data=data)
    status_code = myreq.status_code 
    content = myreq.content.decode('ascii')
    json_data = json.loads(content)
    access_token = json_data['access_token']
    with open("accesstoken.txt", "w") as infile:
        infile.write(access_token)

def main():
    get_auth_key()

if __name__=="__main__":
    main()