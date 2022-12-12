const express = require("express");
const movie = require("../models/Movie.js");
const createError = require("../utils/errors/create-error.js");
const isAuthPassport = require('../utils/middlewares/auth-passport.middleware.js');
const upload = require('../utils/middlewares/file.middleware.js');
const imageToUri = require('image-to-uri');
const fs = require('fs');

const moviesRouter = express.Router();

moviesRouter.get("/", async (req, res, next) => {
  try {
    const movies = await movie.find();
    return res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
});

moviesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const movies = await movie.findById(id);
    if (movies) {
      return res.status(200).json(movies);
    } else {
      next(createError('No existe una película con este id', 404));
    }
  } catch (err) {
    next(err);
  }
});

moviesRouter.get("/title/:title", async (req, res, next) => {
  const title = req.params.title;
  try {
    const movies = await movie.find(
      {
        title: { $eq: title },
      },
      {
        director: 1,
        _id: 0,
      }
    );
    return res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
});

moviesRouter.get("/genre/:genre", async (req, res, next) => {
  const genre = req.params.genre;
  try {
    const movies = await movie.find({
      genre: { $in: genre }
    });
    return res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
});

moviesRouter.get("/year/great2010", async (req, res, next) => {
  req.params.year;
  try {
    const movies = await movie.find({
      year: { $gte: 2010 }
    });
    return res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
});

moviesRouter.post('/', [isAuthPassport, upload.single('picture')], async (req, res, next) => {
  try{
    const filePath = req.file ? req.file.path : null;
    const picture = imageToUri(filePath);
    const newMovie = new movie({ ...req.body, picture });
    const createdMovie = await newMovie.save();
    await fs.unlinkSync(filePath);
    return res.status(201).json(createdMovie);
  } catch (err) {
    next(err);
  }
});

moviesRouter.delete('/:id', [isAuthPassport], async (req, res, next) => {
try{
  const id = req.params.id;
  await movie.findByIdAndDelete(id);
  return res.status(200).json("La pelicula se ha eliminado con exito.");
} catch (err) {
  next(err);
}
});

moviesRouter.put('/:id', [isAuthPassport], async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedMovie = new movie({ ...req.body });
    modifiedMovie._id = id;
    const movieUpdated = await movie.findByIdAndUpdate(id, modifiedMovie, { new:true });
    return res.status(201).json(movieUpdated);
  } catch (err) {
    next(err);
  }
});

module.exports = moviesRouter;