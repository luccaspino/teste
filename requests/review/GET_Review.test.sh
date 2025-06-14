#!/bin/bash
#rever!!!
GAME_ID="ID_DO_JOGO" # Substitua por um ID de jogo válido

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url "http://localhost:3000/games/$GAME_ID/review")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" ]] && [[ "$body" == *"["* ]]; then
  echo "PASS: GET /games/$GAME_ID/review retornou as reviews com sucesso."
else
  echo "FAIL: GET /games/$GAME_ID/review falhou ao buscar as reviews."
  echo "Status: $status"
  echo "Resposta: $body"
fi