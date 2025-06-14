#!/bin/bash
#rever!!!
TOKEN="SEU_TOKEN_AQUI"         # Substitua por um token válido
GAME_ID="ID_DO_JOGO"           # Substitua por um gameId válido

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url http://localhost:3000/library/remove \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data "{\"gameId\": \"$GAME_ID\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" || "$status" == "204" ]]; then
  echo "PASS: POST /library/remove removeu o jogo com sucesso."
else
  echo "FAIL: POST /library/remove falhou."
  echo "Status: $status"
  echo "Resposta: $body"
fi