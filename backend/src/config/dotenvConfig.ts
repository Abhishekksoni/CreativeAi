import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL as string,
  sessionSecret: process.env.SESSION_SECRET as string,
};
