// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { config } from './dotenvConfig';

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.googleClientId || '',
//       clientSecret: config.googleClientSecret,
//       callbackURL: config.googleCallbackURL,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log('Google Profile:', profile); // Debugging
//       return done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user: any, done) => {
//   done(null, user);
// });
