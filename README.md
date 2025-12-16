# RiftBreakersServer

Node.js backend for **Rift Breakers**, a 3D game built with Godot.

This server provides:

* User account registration and login (JWT-based authentication)
* Secure score submission
* Global highscore leaderboard
* Authenticated player info endpoint

---

## Requirements

* **Node.js** (v18+ recommended)
* **MongoDB**
* **npm**

---

## Setup & Run

1. Start MongoDB:

```bash
sudo systemctl start mongod
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (`.env`):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/game
JWT_SECRET=super_secret_key_change_me
```

4. Start the server:

```bash
node server.js
```

Server will run on:

```
http://localhost:3000
```

---

## API Usage (curl)

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"USERNAME_HERE","password":"PASSWORD_HERE","displayName":"DISPLAY_NAME_HERE"}'
```

---

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"USERNAME_HERE","password":"PASSWORD_HERE"}'
```

---

### Submit Score (Authenticated)

```bash
curl -X POST http://localhost:3000/api/score \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"score":AMOUNT_HERE}'
```

> Only higher scores overwrite previous highscores.

---

### Get Global Leaderboard

```bash
curl http://localhost:3000/api/leaderboard
```

---

### Get Logged-in Player Info

```bash
curl http://localhost:3000/api/user/info \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## Notes

* Passwords are hashed using **bcrypt**
* Authentication uses **JWT**
* Leaderboard is sorted by highest score
* All protected endpoints require a valid JWT

---

## License

Personal project — free to learn from and modify.
