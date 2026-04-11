# SakanCampus Mobile

Mobile app workspace (isolated from the existing web and backend apps).

## Run

1. Install dependencies:
- npm install

2. Set env:
- Copy `.env.example` to `.env`
- Update `EXPO_PUBLIC_API_BASE_URL` with your backend URL

3. Start app:
- npm run start
- Press `a` for Android emulator, or scan QR with Expo Go

## Current structure

- src/config/env.js: environment config
- src/api/client.js: API helper
- src/screens/HomeScreen.js: starter screen

## Next steps

- Add Auth screens (Login/Register)
- Add Feed + listing details
- Add Messages + Profile
