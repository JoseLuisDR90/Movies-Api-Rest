const createError = require("../errors/create-error");

//Controlo el tipo de usuario y lo dejo continuar o lo detengo.
const isAuthPassport = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(createError("No tienes permisos", 401));
  }
};
module.exports = isAuthPassport;
