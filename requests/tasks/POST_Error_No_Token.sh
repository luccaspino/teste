curl --request POST \
  --url http://localhost:3000/tasks \
  --header "Authorization: Bearer $1" \
  --header 'Content-Type: application/json' \
  --data '{
    "title": "Erro na criação de tarefa",
    "description": ""
  }'