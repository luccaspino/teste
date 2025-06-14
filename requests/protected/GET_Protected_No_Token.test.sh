#!/bin/bash

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url 'http://localhost:3000/secureExampleRoute/')

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "401" || "$status" == "403" ]]; then
  echo "PASS: GET /secureExampleRoute/ retornou erro sem token."
else
  echo "FAIL: GET /secureExampleRoute/ deveria falhar sem token."
  echo "Status: $status"
  echo "Resposta: $body"
fi