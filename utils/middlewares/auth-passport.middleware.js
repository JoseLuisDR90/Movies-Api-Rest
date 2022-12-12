const createError = require("../errors/create-error");

const isAuthPassport = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return next(createError('No tienes permisos', 401));
    }
};
module.exports = isAuthPassport;