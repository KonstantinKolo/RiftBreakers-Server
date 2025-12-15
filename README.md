# RiftBreakersServer
##### NodeJS backend for my 3D Godot game. It has API endpoints for account creation and login, and a highscore table.
#
to run:
sudo systemctl start mongod
node server.js
#
### commands:
#### register:
##### curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username":"USERNAME_HERE","password":"PASSWORD_HERE","displayName":"DISPLAY_NAME_HERE"}'
#### login:
##### curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"USERNAME_HERE","password":"PASSWORD_HERE"}'
#### set score:
##### curl -X POST http://localhost:3000/api/score -X POST http://localhost:3000/api/score -H "Authorization: Bearer TOKEN_HERE" -H "Content-Type: application/json" -d '{"score":AMOUNT_HERE}'
#### get leaderboard:
##### curl http://localhost:3000/api/leaderboard
#   