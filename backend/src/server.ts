import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { AppDataSource, connectDB } from './config/database';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import imageUploadRoutes from './routes/imageUpload';
import followRoutes from './routes/followRoutes';
import commentRoutes from './routes/commentRoutes';
import { config } from './config/dotenvConfig';
import './config/passport'; // Ensure passport is configured before routes
import { User } from './models/User';
import { UserService } from './service/userService';

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS with allowed origins and credentials
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,  // Allow cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    optionsSuccessStatus: 200
  })
);






// Logging middleware to debug requests
// app.use((req, res, next) => {
//   console.log('Incoming request:', {
//     method: req.method,
//     path: req.path,
//     headers: req.headers,
//   });
//   next();
// });

// Session configuration with enhanced settings
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false,  // Should be false for local development
      httpOnly: true,  
      sameSite: 'lax', 
      maxAge: 1000 * 60 * 60 * 24,
    },
    proxy: true,  // Needed when behind reverse proxies like nginx
  })
);

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy Configuration
const userService = new UserService();

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackURL,
      
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth successful. Profile:', profile);
        const user = await userService.findOrCreateUser(profile);
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, false);
      }
    }
  )
);

// Serialize user ID into session
passport.serializeUser((user: any, done) => {
  console.log('Serializing User:', user);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  console.log('Deserializing User ID:', id);
  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id } });
    if (!user) {
      console.log('User not found during deserialization');
      return done(null, false);
    }
    console.log('Deserialized User:', user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/connect', followRoutes);
app.use('/getUrl', imageUploadRoutes)

// Root route for debugging session persistence
// app.get('/', (req, res) => {
//   res.send(`User: ${JSON.stringify(req.user)}`);
// });

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'blog-backend',
    version: '1.0.0'
  });
});

// Start the server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
