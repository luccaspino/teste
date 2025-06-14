#!/bin/bash
#rever!!!
TASK_ID="681cc57c8c4750dfec7c1acc" # Substitua por um ID de task válido, se necessário
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request PATCH \
  --url http://localhost:3000/tasks/$TASK_ID \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data '{"completed": true}')

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" || "$status" == "204" ]] && [[ "$body" == *"completed"* ]]; then
  echo "PASS: PATCH /tasks/$TASK_ID atualizou a task com sucesso."
else
  echo "FAIL: PATCH /tasks/$TASK_ID falhou ao atualizar a task."
  echo "Status: $status"
  echo "Resposta: $body"
fi