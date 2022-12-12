const mongoose = require("mongoose");

const thisYear = new Date().getFullYear();

const moviesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, lowercase: true },
    director: { type: String, required: true, lowercase: true },
    year: { type: Number, min: [1895,"No puedes crear una película anterior al año de invención del cine."], max: [thisYear, "No puedes crear una pelicula con una fecha superior al año actual." ] },
    genre: { type: String, required: true, lowercase: true },
    picture: String
  },
  {
    timestamps: true,
  }
);

const movie = mongoose.model("movie", moviesSchema);

module.exports = movie;
