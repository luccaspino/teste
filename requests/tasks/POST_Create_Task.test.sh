#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTRlNWRlZDM3YzM2ZDczZmU5YTBlOSIsImlhdCI6MTc0NzAwMDIzNywiZXhwIjoxNzQ3MDAzODM3fQ.cK1DZnDFWcpZol0ZEGwTzIVTSV76FACh_b5LFLTbw3k"

TITLE="Enviar trabalho de FULLSTACK"
DESCRIPTION="Gravar vídeo e concluir README.md"
COMPLETED=false

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url http://localhost:3000/tasks \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data "{\"title\": \"$TITLE\", \"description\": \"$DESCRIPTION\", \"completed\": $COMPLETED}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "201" || "$status" == "200" ]] && [[ "$body" == *"$TITLE"* ]]; then
  echo "PASS: POST /tasks criou a task com sucesso."
else
  echo "FAIL: POST /tasks falhou ao criar a task."
  echo "Status: $status"
  echo "Resposta: $body"
fi