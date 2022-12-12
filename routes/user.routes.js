const express = require("express");
const passport = require("passport");

const userRouter = express.Router();

//Inicio de sesion con usuario registrado
userRouter.post("/register", (req, res, next) => {
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json(user);
    });
  };
  //Lo autentico siguiendo su estrategia
  passport.authenticate("register", done)(req);
});

//Inicio de sesion con usuario creado
userRouter.post("/login", (req, res, next) => {
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  };
  //Lo autentico siguiendo su estrategia
  passport.authenticate("login", done)(req);
});

//Deslogueo al usuario, destruyo la sesion y le digo al navegador que limpie la cookie
userRouter.post("/logout", (req, res, next) => {
  if (req.user) {
    req.logOut(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(200).json("Sesión cerrada!");
      });
    });
  } else {
    return res.status(304).json();
  }
});
module.exports = userRouter;
