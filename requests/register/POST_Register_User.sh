curl --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "newuser123",
    "email": "user123@email.com",
    "password": "securepassword12"
    }'
