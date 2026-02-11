#!/usr/bin/env python3
"""Get access token from Google service account"""
import json
import time
import jwt
import urllib.request
import urllib.parse

# Load service account
with open('/home/openclaw/.openclaw/config/google-sheets-sa.json') as f:
    sa = json.load(f)

# Create JWT
now = int(time.time())
payload = {
    'iss': sa['client_email'],
    'sub': sa['client_email'],
    'scope': 'https://www.googleapis.com/auth/spreadsheets',
    'aud': sa['token_uri'],
    'iat': now,
    'exp': now + 3600
}

# Sign JWT
signed_jwt = jwt.encode(payload, sa['private_key'], algorithm='RS256')

# Exchange for access token
data = urllib.parse.urlencode({
    'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'assertion': signed_jwt
}).encode()

req = urllib.request.Request(sa['token_uri'], data=data, method='POST')
req.add_header('Content-Type', 'application/x-www-form-urlencoded')

with urllib.request.urlopen(req) as response:
    result = json.loads(response.read().decode())
    print(result['access_token'])
