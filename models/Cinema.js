const mongoose = require("mongoose");

//Creo el esquema de un cine y la relación con la collección de peliculas
const cinemasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true },
    location: { type: String, required: true, lowercase: true },
    movies: [{ type: mongoose.Types.ObjectId, ref: "movie" }],
  },
  {
    timestamps: true,
  }
);

const Cinema = mongoose.model("Cinema", cinemasSchema);

module.exports = Cinema;
