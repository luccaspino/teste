curl --request GET \
  --url http://localhost:3000/ratings/game/682dc848b23dafa6c3ef02a8/user \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzFmODY4NjgyZGZmYzQ5ODZlZDNmZSIsImlhdCI6MTc0OTk0OTQ5OSwiZXhwIjoxNzQ5OTUzMDk5fQ.mk84aqkXSYMP5gv9OcF53QSWoolHX_CNjjBMZe8-De4"

# source ./requests/rating/GET_Rating_By_User_And_Game.sh 