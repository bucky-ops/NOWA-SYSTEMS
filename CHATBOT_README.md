# NOWA Systems AI Chatbot

A free, autonomous AI chatbot for NOWA Systems website with escalation to human support.

## Features

- Floating chat widget with dark theme
- Rule-based AI responses using keyword matching
- Escalation to human support with email and WhatsApp notifications
- Message history and input sanitization
- Rate limiting for security
- Data logging to JSON file

## Project Structure

```
chatbot-backend/
├── package.json
├── server.js
└── escalations.json (created automatically)

assets/js/
└── chatbot.js
```

## Setup and Deployment

### Backend Setup

1. Navigate to chatbot-backend directory:
   ```bash
   cd chatbot-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   Create a `.env` file with:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

4. For local development:
   ```bash
   npm run dev
   ```

### Deploy Backend to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd chatbot-backend
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - EMAIL_USER
   - EMAIL_PASS

4. Note the deployed URL (e.g., https://your-app.vercel.app)

### Frontend Integration

1. Update the API URL in `assets/js/chatbot.js`:
   ```javascript
   this.apiUrl = 'https://your-vercel-app.vercel.app';
   ```

2. For WhatsApp notifications, update the phone number in `server.js`:
   ```javascript
   const whatsappUrl = `https://wa.me/254XXXXXXXXX?text=${encodeURIComponent(whatsappMessage)}`;
   ```

### Gmail Setup (Free SMTP)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password as EMAIL_PASS

### Security Notes

- All inputs are sanitized
- Rate limiting prevents abuse
- No API keys exposed to frontend
- Sensitive data stored securely

## Usage

The chatbot will appear as a floating widget on the website. Users can chat, and if the AI can't help, it will escalate to collect user details and notify the team via email and WhatsApp.

## Customization

- Update knowledge base in `server.js`
- Modify AI logic for better responses
- Customize widget appearance in `chatbot.js`