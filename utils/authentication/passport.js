const passport = require("passport");
const User = require("../../models/User");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const createError = require("../errors/create-error");
//creo el autenticador
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, passaword, done) => {
      try {
        const previousUser = await User.findOne({ email });

        if (previousUser) {
          return done(
            createError("Este usuario ya está registrado, inicia sesión")
          );
        }

        const encPassword = await bcrypt.hash(passaword, 10);

        const newUser = new User({
          email,
          password: encPassword,
        });
        const savedUser = await newUser.save();

        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const currentUser = await User.findOne({ email });

        if (!currentUser) {
          return done(
            createError("No existe un usuario con este email, regístrate")
          );
        }

        const isValidPassword = await bcrypt.compare(
          password,
          currentUser.password
        );

        if (!isValidPassword) {
          return done(createError("La contraseña es incorrecta"));
        }

        currentUser.password = null;
        return done(null, currentUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    return done(null, existingUser);
  } catch (err) {
    return done(err);
  }
});
