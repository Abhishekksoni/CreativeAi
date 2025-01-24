import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { AppDataSource, connectDB } from './config/database';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authRoutes from './routes/authRoutes';
import { config } from './config/dotenvConfig';
import './config/passport'; // Ensure passport is configured before routes
import { User } from './models/User';
import { UserService } from './service/userService';

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Session configuration
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

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
        const user = await userService.findOrCreateUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
app.use('/auth', authRoutes);

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
