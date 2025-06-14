#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NjU3MTcyNSwiZXhwIjoxNzQ2NTc1MzI1fQ.8gYP20a_dwd97BCLKyWfx-rMnenR3SEIJKd6a2LWahc"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url 'http://localhost:3000/secureExampleRoute/' \
  --header "Authorization: Bearer $TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" ]]; then
  echo "PASS: GET /secureExampleRoute/ autenticou e retornou sucesso."
else
  echo "FAIL: GET /secureExampleRoute/ falhou na autenticação."
  echo "Status: $status"
  echo "Resposta: $body"
fi