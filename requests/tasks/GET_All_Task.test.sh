#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url http://localhost:3000/tasks \
  --header "Authorization: Bearer $TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" ]] && [[ "$body" == *"["* ]]; then
  echo "PASS: GET /tasks retornou as tasks com sucesso."
else
  echo "FAIL: GET /tasks falhou ao buscar as tasks."
  echo "Status: $status"
  echo "Resposta: $body"
fi