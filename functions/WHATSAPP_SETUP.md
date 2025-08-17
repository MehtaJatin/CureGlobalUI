# WhatsApp Business API Setup Guide

## Prerequisites

1. **Meta Developer Account**: Create an account at https://developers.facebook.com/
2. **WhatsApp Business API**: Set up WhatsApp Business API in your Meta Developer Console
3. **Firebase Project**: Your existing Firebase project

## Step 1: Set up WhatsApp Business API

1. Go to [Meta Developers Console](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add "WhatsApp" product to your app
4. Configure WhatsApp Business API:
   - Get your **Access Token**
   - Get your **Phone Number ID**
   - Set up webhook (optional)

## Step 2: Configure Environment Variables

Set these environment variables in your Firebase Functions:

```bash
# Deploy with environment variables
firebase functions:config:set whatsapp.token="YOUR_WHATSAPP_ACCESS_TOKEN"
firebase functions:config:set whatsapp.phone_number_id="YOUR_PHONE_NUMBER_ID"
```

Or set them in Firebase Console:
1. Go to Firebase Console → Functions → Configuration
2. Add environment variables:
   - `WHATSAPP_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`

## Step 3: Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:onBookingCreated
```

## Step 4: Test the Integration

1. **Test WhatsApp Connection**:
   ```bash
   curl -X POST https://your-region-your-project.cloudfunctions.net/testWhatsAppConnection
   ```

2. **Submit a booking** in your Angular app
3. **Check WhatsApp** for the notification message

## Functions Available

### 1. `onBookingCreated`
- **Trigger**: Automatically triggered when a new booking is created in Firestore
- **Action**: Sends WhatsApp notification to the patient's phone number
- **Message Format**: Formatted appointment request with all booking details

### 2. `sendWhatsAppNotification`
- **Type**: Callable function
- **Purpose**: Manually send WhatsApp messages
- **Usage**: Call from your Angular app

### 3. `testWhatsAppConnection`
- **Type**: HTTP function
- **Purpose**: Test WhatsApp API connection
- **URL**: `https://your-region-your-project.cloudfunctions.net/testWhatsAppConnection`

## Message Format

The WhatsApp message includes:
- 🏥 Hospital branding
- 👤 Patient name
- 📧 Email address
- 📱 Phone number
- 💬 Patient query
- 📅 Submission timestamp
- 🆔 Booking ID

## Troubleshooting

1. **Check Firebase Functions logs**:
   ```bash
   firebase functions:log
   ```

2. **Verify WhatsApp API credentials**
3. **Check phone number format** (should include country code)
4. **Ensure WhatsApp Business API is properly configured**

## Security Notes

- Keep your WhatsApp tokens secure
- Use environment variables, never hardcode tokens
- Consider implementing rate limiting
- Add authentication to manual functions in production
