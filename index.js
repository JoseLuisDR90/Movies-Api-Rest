require('dotenv').config();
const express = require("express");
const moviesRouter = require("./routes/movie.routes.js");
const connect = require('./utils/db/connect.js');
const cors = require('cors');
const createError = require("./utils/errors/create-error.js");
const cinemaRouter = require("./routes/cinema.routes.js");
const passport = require('passport');
const userRouter = require("./routes/user.routes.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require("path");
const DB_URL = process.env.DB_URL;

connect();

const PORT = process.env.PORT || 4001;
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(express.static(path.join(__dirname, 'public')));

//Inicializamos y configuramos passport(ejecutando todo el archivo)
require('./utils/authentication/passport.js');

server.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 3600000 
  }, 
  store: MongoStore.create({
    mongoUrl: DB_URL
  })
}));

server.use(passport.initialize());

server.use(passport.session());

server.get('/', (req, res) => {
  res.json("Bienvenido a mi API de Movies!!!")
})

server.use("/user", userRouter);

server.use("/movies", moviesRouter);

server.use("/cinema", cinemaRouter);

server.use('*', (req, res, next) => {
  next(createError('Esta ruta no existe', 404));
});

server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || 'Unexpected error');
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Url: http:localhost:${PORT}`);
});

module.exports = server;