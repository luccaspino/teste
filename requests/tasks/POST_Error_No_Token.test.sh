#!/bin/bash

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url http://localhost:3000/tasks \
  --header 'Content-Type: application/json' \
  --data '{"title": "Erro na criação de tarefa", "description": ""}')

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "401" || "$status" == "403" ]]; then
  echo "PASS: POST /tasks retornou erro sem token."
else
  echo "FAIL: POST /tasks deveria falhar sem token."
  echo "Status: $status"
  echo "Resposta: $body"
fi