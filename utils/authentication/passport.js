const passport = require("passport");
const User = require("../../models/User");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const createError = require("../errors/create-error");

//Creo la estrategia de registro, mediante email y password
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    }, //Verifico si hay un registro previo
    async (req, email, passaword, done) => {
      try {
        const previousUser = await User.findOne({ email });

        if (previousUser) {
          return done(
            createError("Este usuario ya está registrado, inicia sesión")
          );
        }
        //Encripto la password
        const encPassword = await bcrypt.hash(passaword, 10);
        //Creo el usuario y lo gusardo en la BD
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

//Creo la estrategia de Login
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    }, //Reviso que exista el email
    async (req, email, password, done) => {
      try {
        const currentUser = await User.findOne({ email });

        if (!currentUser) {
          return done(
            createError("No existe un usuario con este email, regístrate")
          );
        }
        //Reviso que la contraseña coincida con la de la BD
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
//Registra usuario por si id
passport.serializeUser((user, done) => {
  return done(null, user._id);
});
//Busca un usuario por su id
passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    return done(null, existingUser);
  } catch (err) {
    return done(err);
  }
});
