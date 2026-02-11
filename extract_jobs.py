#!/usr/bin/env python3
"""Extract job URLs using direct HTTP requests with JWT auth."""

import json
import base64
import hashlib
import time
import urllib.request
import urllib.error
import ssl

# Service account details
SA_FILE = '/home/openclaw/.openclaw/config/google-sheets-sa.json'
SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA'
RANGE = 'Job%20Applications!B10:I73'  # URL encoded

TARGET_COMPANIES = {
    'Confidential Company',
    'Bisher & Partners',
    'Confidential - Construction/EPC',
    'New Metrics',
    'American Express Saudi Arabia',
    'RiskPod',
    'Banking Client',
    'Government/Public Sector Client',
    'Al Masraf Bank',
    'PwC Strategy&',
}

def base64url_encode(data):
    """Base64URL encode without padding."""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

def create_jwt(sa_data):
    """Create a JWT for Google OAuth."""
    now = int(time.time())
    
    header = json.dumps({"alg":"RS256","typ":"JWT"})
    
    claim = json.dumps({
        "iss": sa_data['client_email'],
        "sub": sa_data['client_email'],
        "scope": "https://www.googleapis.com/auth/spreadsheets.readonly",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600
    })
    
    header_b64 = base64url_encode(header)
    claim_b64 = base64url_encode(claim)
    
    signing_input = f"{header_b64}.{claim_b64}"
    
    # For now, let me try using the token endpoint with a simpler approach
    # Since we don't have crypto library, let's use a different approach
    return None

def get_access_token(sa_data):
    """Get access token using service account."""
    # Try using gcloud or another method - actually let's try using the token endpoint
    # We need to sign the JWT with the private key
    
    # Since we don't have cryptography library, let's use an alternative
    # Let's make a direct request using API key if available or another method
    
    # Actually, let me try a simpler approach - using the token endpoint with assertion
    import subprocess
    
    # Check if gcloud is available
    try:
        result = subprocess.run(['gcloud', 'auth', 'application-default', 'print-access-token'],
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            return result.stdout.strip()
    except:
        pass
    
    return None

def fetch_with_urllib(url):
    """Fetch URL using urllib."""
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(url, context=ctx, timeout=30) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {"error": str(e), "body": e.read().decode('utf-8')}

def main():
    # Load service account
    with open(SA_FILE) as f:
        sa_data = json.load(f)
    
    # Try to get access token
    token = get_access_token(sa_data)
    
    if not token:
        print("Could not obtain access token. Trying alternative method...")
        # Try using the API with API key or make the JWT work
        # Let me try using subprocess with openssl for signing
        pass
    
    # For now, let's try to use a simple API key approach or manual method
    print("Attempting to fetch sheet data...")
    
    # URL for the API
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{RANGE}"
    
    if token:
        req = urllib.request.Request(url)
        req.add_header('Authorization', f'Bearer {token}')
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                data = json.loads(response.read().decode('utf-8'))
                process_data(data)
                return
        except Exception as e:
            print(f"Error with token: {e}")
    
    # Alternative: print instructions
    print("\nAlternative approach needed. Checking for oauth2l or other tools...")

import subprocess

def sign_jwt_with_openssl(sa_data, signing_input):
    """Sign JWT using openssl command line."""
    private_key = sa_data['private_key']
    
    # Write private key to temp file
    import tempfile
    import os
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.pem', delete=False) as f:
        f.write(private_key)
        key_file = f.name
    
    try:
        # Create digest and sign
        proc = subprocess.run(
            ['openssl', 'dgst', '-sha256', '-sign', key_file],
            input=signing_input.encode(),
            capture_output=True
        )
        
        if proc.returncode != 0:
            return None
        
        signature = base64.urlsafe_b64encode(proc.stdout).rstrip(b'=').decode('ascii')
        return signature
    finally:
        os.unlink(key_file)

def get_token_with_openssl(sa_data):
    """Get OAuth token using openssl for signing."""
    now = int(time.time())
    
    header = json.dumps({"alg":"RS256","typ":"JWT"})
    claim = json.dumps({
        "iss": sa_data['client_email'],
        "sub": sa_data['client_email'],
        "scope": "https://www.googleapis.com/auth/spreadsheets.readonly",
        "aud": "https://oauth2.googleapis.com/token",
        "iat": now,
        "exp": now + 3600
    })
    
    header_b64 = base64url_encode(header)
    claim_b64 = base64url_encode(claim)
    signing_input = f"{header_b64}.{claim_b64}"
    
    signature = sign_jwt_with_openssl(sa_data, signing_input)
    if not signature:
        return None
    
    jwt = f"{signing_input}.{signature}"
    
    # Exchange JWT for access token
    token_data = urllib.parse.urlencode({
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion': jwt
    }).encode()
    
    req = urllib.request.Request(
        'https://oauth2.googleapis.com/token',
        data=token_data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            resp_data = json.loads(response.read().decode())
            return resp_data.get('access_token')
    except Exception as e:
        print(f"Token exchange error: {e}")
        return None

def process_data(data):
    """Process the sheet data."""
    rows = data.get('values', [])
    matches = []
    start_row = 10
    
    for i, row in enumerate(rows):
        current_row_num = start_row + i
        
        if len(row) < 1:
            continue
        
        company = row[0].strip() if row[0] else ''
        
        if company in TARGET_COMPANIES:
            role = row[2].strip() if len(row) > 2 and row[2] else 'N/A'
            url = row[7].strip() if len(row) > 7 and row[7] else 'N/A'
            
            matches.append({
                'row': current_row_num,
                'company': company,
                'role': role,
                'url': url
            })
    
    print(f"Found {len(matches)} matching rows:\n")
    print("-" * 80)
    
    for match in matches:
        print(f"Row {match['row']} | {match['company']} | {match['role']} | {match['url']}")
    
    print("\n" + "=" * 80)
    print("SUMMARY BY COMPANY:")
    print("=" * 80)
    
    for company in sorted(TARGET_COMPANIES):
        company_matches = [m for m in matches if m['company'] == company]
        print(f"\n{company}: {len(company_matches)} job(s)")
        for m in company_matches:
            print(f"  - Row {m['row']}: {m['role']}")

def main():
    with open(SA_FILE) as f:
        sa_data = json.load(f)
    
    # Get token using openssl
    token = get_token_with_openssl(sa_data)
    
    if not token:
        print("Failed to obtain access token")
        return
    
    # Make the API request
    range_encoded = 'Job%20Applications!B10:I73'
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{range_encoded}"
    
    req = urllib.request.Request(url)
    req.add_header('Authorization', f'Bearer {token}')
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
            process_data(data)
    except Exception as e:
        print(f"Error fetching data: {e}")

if __name__ == '__main__':
    main()
