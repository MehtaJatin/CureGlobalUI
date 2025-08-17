# WhatsApp Business API Integration Guide

## 🎯 Overview

This guide will help you integrate WhatsApp Business API with your Medical App to send automatic notifications when patients book appointments.

## 📋 Prerequisites

1. **Meta Developer Account**: https://developers.facebook.com/
2. **WhatsApp Business API**: Set up in Meta Developer Console
3. **Firebase Project**: Your existing project (medical-ad035)
4. **Angular App**: Your current medical app

## 🚀 Step-by-Step Setup

### Step 1: Set up WhatsApp Business API

1. **Go to Meta Developers Console**:

   - Visit: https://developers.facebook.com/
   - Sign in with your Facebook account

2. **Create a New App**:

   - Click "Create App"
   - Choose "Business" as the app type
   - Fill in app details

3. **Add WhatsApp Product**:

   - In your app dashboard, click "Add Product"
   - Find and add "WhatsApp" product

4. **Configure WhatsApp Business API**:
   - Go to WhatsApp → Getting Started
   - Note down your **Phone Number ID**
   - Generate an **Access Token**
   - Set up webhook (optional for now)

### Step 2: Update Configuration

1. **Update WhatsApp Service**:

   - Open: `src/app/backend/whatsapp.service.ts`
   - Replace `YOUR_WHATSAPP_TOKEN` with your actual token
   - Replace `YOUR_PHONE_NUMBER_ID` with your phone number ID
   - Update test phone number in `testConnection()` method

2. **Example Configuration**:
   ```typescript
   private readonly WHATSAPP_TOKEN = 'EAAG...'; // Your actual token
   private readonly WHATSAPP_PHONE_NUMBER_ID = '123456789'; // Your phone number ID
   ```

### Step 3: Test the Integration

1. **Start your Angular app**:

   ```bash
   ng serve --port 4201
   ```

2. **Navigate to booking page**:

   - Go to: http://localhost:4201/booking

3. **Test WhatsApp Connection**:

   - Click "Test WhatsApp Connection" button
   - Check browser console for results
   - You should receive a test message on WhatsApp

4. **Submit a test booking**:
   - Fill out the booking form
   - Submit the form
   - Check WhatsApp for the notification

## 🔧 How It Works

### Flow:

1. **Patient submits booking** → Angular form
2. **Data stored in Firebase** → Firestore database
3. **WhatsApp notification sent** → Patient's phone number
4. **Success message shown** → User interface

### WhatsApp Message Format:

```
🏥 New Appointment Request

👤 Patient Name: John Doe
📧 Email: john@example.com
📱 Phone: 9876543210
💬 Query: Need dental checkup
📅 Submitted: 1/15/2024, 10:30 AM
🆔 Booking ID: abc123def456

Please review and respond to this appointment request.
```

## 📱 Phone Number Format

The system automatically formats phone numbers:

- **Input**: `9876543210` or `+91 9876543210`
- **Output**: `919876543210` (with country code)

## 🧪 Testing

### Test WhatsApp Connection:

- Click "Test WhatsApp Connection" button
- Check console for API response
- Verify message received on WhatsApp

### Test Booking Flow:

1. Fill booking form with test data
2. Submit form
3. Check Firebase Console for stored data
4. Check WhatsApp for notification message

## 🔍 Troubleshooting

### Common Issues:

1. **"WhatsApp connection test failed"**:

   - Check your WhatsApp token
   - Verify phone number ID
   - Ensure WhatsApp Business API is properly configured

2. **"CORS error"**:

   - WhatsApp API doesn't support CORS from browsers
   - Use Firebase Functions for production (requires Blaze plan)

3. **"Invalid phone number"**:

   - Ensure phone number includes country code
   - Format: `919876543210` (India)

4. **"Authentication failed"**:
   - Check your access token
   - Verify token hasn't expired

### Debug Steps:

1. **Check browser console** for error messages
2. **Verify API credentials** in WhatsApp service
3. **Test with different phone numbers**
4. **Check Firebase Console** for stored bookings

## 🚀 Production Deployment

### Option 1: Firebase Functions (Recommended)

- Requires Blaze (pay-as-you-go) plan
- More secure (tokens not exposed in frontend)
- Better error handling

### Option 2: Backend Server

- Create a Node.js/Express server
- Handle WhatsApp API calls server-side
- Deploy to Heroku, Vercel, or similar

### Option 3: Current Setup (Development)

- Works for testing and development
- Tokens exposed in frontend (not recommended for production)

## 📞 Support

If you encounter issues:

1. Check Meta Developer Console for API status
2. Verify your WhatsApp Business API setup
3. Review Firebase Console logs
4. Check browser console for detailed error messages

## 🔐 Security Notes

- **Never commit tokens to version control**
- **Use environment variables in production**
- **Implement rate limiting**
- **Add authentication for admin functions**
- **Regularly rotate access tokens**

## 📈 Next Steps

1. **Set up proper environment variables**
2. **Implement error handling and retries**
3. **Add message templates for different scenarios**
4. **Create admin dashboard for managing bookings**
5. **Add two-way communication (patient responses)**
6. **Implement message scheduling**
7. **Add analytics and reporting**

---

**Happy Coding! 🎉**
