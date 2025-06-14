curl --request POST \
  --url 'http://localhost:3000/users/login' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "string",
    "email": "string@gmail.com",
    "password": "string"
    }'

// source ./requests/login/POST_Login_User.sh