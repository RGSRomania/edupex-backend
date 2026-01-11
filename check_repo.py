import urllib.request
import json

try:
    url = "https://api.github.com/repos/RGSRomania/edupex-backend"
    req = urllib.request.Request(url)
    req.add_header('Accept', 'application/vnd.github.v3+json')

    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        print(f"Repository: {data['name']}")
        print(f"URL: {data['html_url']}")
        print(f"Description: {data.get('description', 'N/A')}")
        print(f"Last push: {data.get('pushed_at', 'N/A')}")
        print(f"Default branch: {data.get('default_branch', 'N/A')}")
except Exception as e:
    print(f"Error: {e}")

