/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions';
import { onRequest, onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import axios from 'axios';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// WhatsApp Business API configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'YOUR_WHATSAPP_TOKEN';
const WHATSAPP_PHONE_NUMBER_ID =
  process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';
const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

// Interface for booking data
interface BookingData {
  name: string;
  email: string;
  phone: string;
  query: string;
  createdAt: FirebaseFirestore.Timestamp;
  status: string;
}

/**
 * Sends a WhatsApp message using the WhatsApp Business API
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The message to send
 * @return {Promise<object>} The API response
 */
async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('WhatsApp message sent successfully', response.data);
    return response.data;
  } catch (error) {
    logger.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

// Cloud Function triggered when a new booking is created in Firestore
export const onBookingCreated = onDocumentCreated(
  'bookings/{bookingId}',
  async (event) => {
    try {
      const bookingData = event.data?.data() as BookingData;
      const bookingId = event.params.bookingId;

      if (!bookingData) {
        logger.error('No booking data found');
        return;
      }

      // Format phone number (remove + if present and ensure it starts with country code)
      let phoneNumber = bookingData.phone
        .replace(/\s+/g, '')
        .replace(/^\+/, '');

      // If phone number doesn't start with country code, assume it's Indian (+91)
      if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
        phoneNumber = `91${phoneNumber}`;
      }

      // Create WhatsApp message
      const message = `🏥 *New Appointment Request*

👤 *Patient Name:* ${bookingData.name}
📧 *Email:* ${bookingData.email}
📱 *Phone:* ${bookingData.phone}
💬 *Query:* ${bookingData.query}
📅 *Submitted:* ${new Date(bookingData.createdAt.toDate()).toLocaleString()}
🆔 *Booking ID:* ${bookingId}

Please review and respond to this appointment request.`;

      // Send WhatsApp message
      await sendWhatsAppMessage(phoneNumber, message);

      logger.info(`WhatsApp notification sent for booking ${bookingId}`);
    } catch (error) {
      logger.error('Error in onBookingCreated function:', error);
    }
  }
);

// HTTP callable function to send WhatsApp message manually
export const sendWhatsAppNotification = onCall(
  { maxInstances: 10 },
  async (request) => {
    try {
      const { phoneNumber, message } = request.data;

      if (!phoneNumber || !message) {
        throw new Error('Phone number and message are required');
      }

      const result = await sendWhatsAppMessage(phoneNumber, message);

      return {
        success: true,
        messageId: result.messages?.[0]?.id,
        data: result,
      };
    } catch (error) {
      logger.error('Error in sendWhatsAppNotification:', error);
      throw new Error('Failed to send WhatsApp message');
    }
  }
);

// Test function to verify WhatsApp API connection
export const testWhatsAppConnection = onRequest(async (req, res) => {
  try {
    const testMessage =
      '🧪 This is a test message from your Medical App WhatsApp integration!';
    const testPhone = '919876543210'; // Replace with your test phone number

    const result = await sendWhatsAppMessage(testPhone, testMessage);

    res.json({
      success: true,
      message: 'WhatsApp connection test successful',
      data: result,
    });
  } catch (error) {
    logger.error('WhatsApp connection test failed:', error);
    res.status(500).json({
      success: false,
      error: 'WhatsApp connection test failed',
      details: error,
    });
  }
});
