curl -s -H Metadata:true --noproxy "*" "http://169.254.169.254/metadata/instance?api-version=2021-02-01" | \
python3 -c 'import json, sys; data = json.load(sys.stdin); print(json.dumps({"name": data["compute"]["name"], "location": data["compute"]["location"]}));' >> vm_info.json
