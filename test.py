import requests

# Get a random cat fact
url = "https://catfact.ninja/fact"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("Random Cat Fact:", data["fact"])
else:
    print("Failed to fetch data. Status code:", response.status_code)
