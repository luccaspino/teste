#!/bin/bash
#rever!!!
TOKEN="SEU_TOKEN_AQUI" # Substitua por um token válido

response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request GET \
  --url http://localhost:3000/wishlist \
  --header "Authorization: Bearer $TOKEN")

body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$status" == "200" ]] && [[ "$body" == *"["* ]]; then
  echo "PASS: GET /wishlist retornou a wishlist com sucesso."
else
  echo "FAIL: GET /wishlist falhou ao buscar a wishlist."
  echo "Status: $status"
  echo "Resposta: $body"
fi