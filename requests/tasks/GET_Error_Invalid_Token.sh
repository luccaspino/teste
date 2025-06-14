curl --request GET \
  --url http://localhost:3000/tasks \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer invalid.token.value"