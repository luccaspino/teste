curl --request POST \
  --url http://localhost:3000/library/add \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer SEU_TOKEN_AQUI" \
  --data '{
    "gameId": "ID_DO_JOGO"
  }'