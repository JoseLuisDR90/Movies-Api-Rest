const multer = require("multer");
const path = require("path");
const createError = require("../errors/create-error");

//Indico que extensiones aceptamos
const VALID_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

//Valido si la extensión es aceptada
const fileFilter = (req, file, cb) => {
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    cb(createError("El tipo de archivo no es válido"));
  } else {
    cb(null, true);
  }
};

//Asigno el nombre al archivo y le indico donde guardarlo
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "/tmp/");
  },
});

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
