#!/bin/bash

TASK_ID="FAKE_TASK_ID" # ID de task inexistente ou não autorizado
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url http://localhost:3000/tasks/$TASK_ID \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "401" || "$status" == "403" || "$status" == "404" ]]; then
  echo "PASS: GET /tasks/$TASK_ID retornou erro de acesso não autorizado ou não encontrado."
else
  echo "FAIL: GET /tasks/$TASK_ID deveria falhar para acesso não autorizado ou inexistente."
  echo "Status: $status"
  echo "Resposta: $body"
fi