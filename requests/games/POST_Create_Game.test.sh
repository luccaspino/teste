# Define os dados do jogo para o teste
json_data='{
  "title": "test_title",
  "description": "test_description",
  "genre": "test_genre",
  "releaseDate": "2024-01-01"
}'

# Faz a requisição POST e captura o status HTTP e o corpo da resposta
response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
  --request POST \
  --url http://localhost:3000/games \
  --header "Content-Type: application/json" \
  --data "$json_data")

# Separa o corpo e o status
body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

# Testa se o status é 201
if [ "$status" -eq 201 ]; then
  echo "Status code test: PASS"
else
  echo "Status code test: FAIL (got $status)"
  exit 1
fi

# Testa se o corpo contém o título enviado
if echo "$body" | grep -q '"title":"test_title"'; then
  echo "Response body title test: PASS"
else
  echo "Response body title test: FAIL"
  exit 1
fi

echo "All tests passed."