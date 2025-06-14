#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url http://localhost:3000/tasks \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data '{"description": ""}')

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "400" || "$status" == "422" ]]; then
  echo "PASS: POST /tasks retornou erro para requisição malformada."
else
  echo "FAIL: POST /tasks deveria falhar para requisição malformada."
  echo "Status: $status"
  echo "Resposta: $body"
fi