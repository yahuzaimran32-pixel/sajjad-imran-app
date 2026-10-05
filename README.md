# Sajjad Imran Catering App

A simple catering order and Pi payment app for Sajjad Imran in Kano, Nigeria.

## Features
- Business profile and contact details
- Menu selection (Class One & VIP Class Two)
- Pi Network cryptocurrency payment flow
- Local backend for order creation and completion
- Mobile-friendly luxury gold/dark theme UI
- Hausa language support

## Prerequisites
- Node.js 18+
- npm
- A browser with Pi SDK support
- Pi Developer account (for real production submission)

## Local Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yahuzaimran32-pixel/sajjad-imran-app.git
   cd sajjad-imran-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials (optional for local testing).

5. Start the app:
   ```bash
   npm start
   ```

6. Open in browser:
   ```
   http://localhost:3000
   ```

## Deploy to Vercel (Easiest)

1. Push this repo to GitHub
2. Go to https://vercel.com
3. Click "Add New Project"
4. Select this repository
5. Click "Deploy"

That's it! Vercel will automatically build and host your app.

## Production Notes

For real Pi Network app registration and submission:

1. **Create a Pi Developer account** at https://developers.minepi.com/
2. **Register your app** with:
   - App name: Sajjad Imran Catering
   - App URL: `https://your-vercel-app.vercel.app`
   - Callback URL: `https://your-vercel-app.vercel.app/api/complete-order`
3. **Copy your Pi App ID** and add it to the environment variables
4. **Configure payment verification** in `server.js` using official Pi API
5. **Test with Pi testnet** before going live

## Project Structure
```
sajjad-imran-app/
├── public/
│   ├── index.html      (Main page)
│   ├── app.js          (Payment logic)
│   └── styles.css      (Styling)
├── server.js           (Express backend)
├── package.json        (Dependencies)
├── vercel.json         (Vercel config)
├── .env.example        (Environment template)
└── README.md           (This file)
```

## API Endpoints

- `GET /api/health` — Check if server is running
- `POST /api/create-order` — Create a new order
- `POST /api/complete-order` — Mark order as completed
- `POST /api/verify-payment` — Verify Pi payment

## Support

For issues or questions:
- Contact: 08136429301 (WhatsApp)
- Address: No. 1550, Kofar Gadar Mamata, Kano
- OPay: 7016289293

## License

MIT License - Feel free to use and modify for your business.
