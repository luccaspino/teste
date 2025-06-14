#!/bin/bash
#rever!!!
TASK_ID="681cc57c8c4750dfec7c1acc" # Substitua por um ID de task válido, se necessário
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

TITLE="Estudar Sistemas"
DESCRIPTION="Finalizar slides e estudar falas"
COMPLETED=true

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request PUT \
  --url http://localhost:3000/tasks/$TASK_ID \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data "{\"title\": \"$TITLE\", \"description\": \"$DESCRIPTION\", \"completed\": $COMPLETED}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" || "$status" == "204" ]] && [[ "$body" == *"$TITLE"* ]]; then
  echo "PASS: PUT /tasks/$TASK_ID atualizou a task com sucesso."
else
  echo "FAIL: PUT /tasks/$TASK_ID falhou ao atualizar a task."
  echo "Status: $status"
  echo "Resposta: $body"
fi