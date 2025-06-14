# Faz a requisição GET e captura o status HTTP e o corpo da resposta
response=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" --request GET --url http://localhost:3000/games)

# Separa o corpo e o status
body=$(echo "$response" | sed -e 's/HTTPSTATUS\:.*//g')
status=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

# Testa se o status é 200
if [ "$status" -eq 200 ]; then
  echo "Status code test: PASS"
else
  echo "Status code test: FAIL (got $status)"
  exit 1
fi

# Testa se o corpo contém um array (verifica se contém '[')
if echo "$body" | grep -q '\['; then
  echo "Response body array test: PASS"
else
  echo "Response body array test: FAIL"
  exit 1
fi

echo "All tests passed."