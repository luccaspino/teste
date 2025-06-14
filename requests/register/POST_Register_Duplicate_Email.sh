curl --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "duplicateuser",
    "email": "user@email.com",
    "password": "anotherpassword"
  }'
