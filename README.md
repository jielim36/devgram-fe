# Getting Started
---

#### Step 1:
Environment File: create a `.env` file in root path (`/devgram-fe/.env`)
```
# Web Config
VITE_SERVER_URL=http://localhost:8080
VITE_WEBSITE_URL=http://localhost:3000
VITE_GOOGLE_MAP_API_KEY=xxx
VITE_PORT=3000

# Pusher Config
VITE_PUSHER_APP_ID = "xxx"
VITE_PUSHER_KEY = "xxx"
VITE_PUSHER_SECRET = "xxx"
VITE_PUSHER_CLUSTER = "xxx"

# Firebase Config
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MEASUREMENT_ID=xxx
VITE_FIREBASE_VAPID_KEY=xxx
```

#### Step 2:
Open terminal in root path:
```
$ pnpm i
$ pnmm dev
```