import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Estudiante from '../models/Estudiante.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL_BACKEND}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar por googleId
        let estudiante = await Estudiante.findOne({ googleId: profile.id });
        
        if (estudiante) {
          return done(null, estudiante);
        }
        
        // Buscar por email
        estudiante = await Estudiante.findOne({ email: profile.emails[0].value });
        
        if (estudiante) {
          // Actualizar con googleId
          estudiante.googleId = profile.id;
          estudiante.authProvider = 'google';
          estudiante.confirmEmail = true;
          await estudiante.save();
          return done(null, estudiante);
        }
        
        // Crear nuevo
        const nuevoEstudiante = new Estudiante({
          googleId: profile.id,
          nombre: profile.name.givenName,
          apellido: profile.name.familyName,
          email: profile.emails[0].value,
          fotoPerfil: { url: profile.photos[0]?.value },
          confirmEmail: true,
          authProvider: 'google',
          cedula: `GOOGLE-${profile.id.substring(0, 10)}`,
          carrera: 'Por definir',
          nivel: 1,
          password: Math.random().toString(36).slice(-10),
        });
        
        await nuevoEstudiante.save();
        done(null, nuevoEstudiante);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialización
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Estudiante.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;