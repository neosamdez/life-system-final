import urllib.request
import urllib.error
import json
import time
import sys

BASE_URL = "http://localhost:8000/api/v1"

def request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    if data:
        data_bytes = json.dumps(data).encode("utf-8")
    else:
        data_bytes = None
        
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 204:
                return None
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Error {e.code} calling {endpoint}: {e.read().decode('utf-8')}")
        raise

def run_test():
    print("Starting Verification...")
    
    # 1. Register
    ts = int(time.time())
    email = f"test_{ts}@example.com"
    password = "password123"
    username = f"user_{ts}"
    
    print(f"Registering user {email}...")
    try:
        request("POST", "/auth/register", {
            "email": email,
            "password": password,
            "username": username
        })
    except urllib.error.HTTPError as e:
        print(f"Registration failed: {e}")

    # 2. Login
    print("Logging in...")
    try:
        login_res = request("POST", "/auth/login", {
            "email": email,
            "password": password
        })
    except urllib.error.HTTPError:
        print("Login failed.")
        return

    token = login_res["access_token"]
    print("Logged in.")

    # 3. Get Stats
    print("Getting Stats...")
    stats = request("GET", "/stats", token=token)
    print(f"Stats: Level {stats['level']}, XP {stats['current_xp']}, HP {stats['hp']}")
    
    if stats['level'] != 1:
        print("FAIL: Expected Level 1")
    
    # 4. Create Quest
    print("Creating Quest...")
    quest = request("POST", "/quests", {
        "title": "Test Quest",
        "description": "A test quest",
        "difficulty": "E",
        "xp_reward": 150,
        "attribute_reward": "STR"
    }, token=token)
    print(f"Quest created: ID {quest['id']}")

    # 5. Complete Quest
    print("Completing Quest...")
    complete_res = request("POST", f"/quests/{quest['id']}/complete", token=token)
    print(f"Completion Result: {complete_res['message']}")
    print(f"Level Up: {complete_res['level_up']}")
    
    if not complete_res['level_up']:
        print("FAIL: Expected Level Up")

    # 6. Check Stats Again
    print("Checking Stats after Level Up...")
    stats = request("GET", "/stats", token=token)
    print(f"Stats: Level {stats['level']}, XP {stats['current_xp']}, HP {stats['hp']}")
    
    if stats['level'] != 2:
        print("FAIL: Expected Level 2")
    if stats['current_xp'] != 50: # 150 - 100 = 50
        print(f"FAIL: Expected 50 XP, got {stats['current_xp']}")
    if stats['strength'] != 2: # Started at 1, +1 reward
        print(f"FAIL: Expected Strength 2, got {stats['strength']}")

    # 7. Finance
    print("Creating Transaction...")
    txn = request("POST", "/transactions", {
        "type": "INCOME",
        "amount": 1000.50,
        "category": "Salary",
        "description": "Monthly Salary"
    }, token=token)
    print(f"Transaction created: {txn['id']}")
    
    print("Listing Transactions...")
    txns = request("GET", "/transactions", token=token)
    print(f"Found {len(txns)} transactions")
    if len(txns) < 1:
        print("FAIL: Expected at least 1 transaction")

    print("Verification Complete.")

if __name__ == "__main__":
    run_test()
