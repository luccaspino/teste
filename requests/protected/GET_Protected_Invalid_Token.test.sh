#!/bin/bash

INVALID_TOKEN="invalidtoken123"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url 'http://localhost:3000/secureExampleRoute/' \
  --header "Authorization: Bearer $INVALID_TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "401" || "$status" == "403" ]]; then
  echo "PASS: GET /secureExampleRoute/ retornou erro para token inválido."
else
  echo "FAIL: GET /secureExampleRoute/ deveria falhar para token inválido."
  echo "Status: $status"
  echo "Resposta: $body"
fi