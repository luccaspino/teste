#!/bin/bash
#rever!!!
TOKEN="SEU_TOKEN_AQUI"      # Substitua por um token válido
GAME_ID="ID_DO_JOGO"        # Substitua por um gameId válido

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url http://localhost:3000/wishlist/add \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $TOKEN" \
  --data "{\"gameId\": \"$GAME_ID\"}")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "201" || "$status" == "200" ]] && [[ "$body" == *"$GAME_ID"* ]]; then
  echo "PASS: POST /wishlist/add adicionou o jogo com sucesso."
else
  echo "FAIL: POST /wishlist/add falhou ao adicionar o jogo."
  echo "Status: $status"
  echo "Resposta: $body"
fi