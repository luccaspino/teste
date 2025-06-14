curl --request POST \
  --url http://localhost:3000/games \
  --header "Content-Type: application/json" \
  --data '{
    "title": "sometitle",
    "description": "somedescription",
    "genre": "somgegenre",
    "releaseDate": "XXXX-XX-XX"
  }'