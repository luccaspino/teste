curl --request POST \
  --url 'http://localhost:3000/users/login' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "stringg",
    "email": "stringg@gmail.com",
    "password": "stringg"
    }'

// source ./requests/login/POST_Login_User.sh