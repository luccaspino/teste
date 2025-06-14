# test_GET_Library.sh
#rever!!!
#!/bin/bash

# Substitua pelo seu token real antes de rodar o teste
TOKEN="SEU_TOKEN_AQUI"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url http://localhost:3000/library \
  --header "Authorization: Bearer $TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ "$status" -eq 200 ]; then
  echo "Status code test: PASS"
else
  echo "Status code test: FAIL (got $status)"
  exit 1
fi

if echo "$body" | grep -q '\['; then
  echo "Response body array test: PASS"
else
  echo "Response body array test: FAIL"
  exit 1
fi

echo "All tests passed."