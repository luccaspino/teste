#!/bin/bash
#rever!!!
TASK_ID="681cc57c8c4750dfec7c1acc" # Substitua por um ID de task válido, se necessário
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url http://localhost:3000/tasks/$TASK_ID \
  --header "Authorization: Bearer $TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" ]] && [[ "$body" == *"$TASK_ID"* ]]; then
  echo "PASS: GET /tasks/$TASK_ID retornou a task com sucesso."
else
  echo "FAIL: GET /tasks/$TASK_ID falhou ao buscar a task."
  echo "Status: $status"
  echo "Resposta: $body"
fi