const express = require("express");
const Cinema = require("../models/Cinema.js");
const createError = require("../utils/errors/create-error.js");
const isAuthPassport = require('../utils/middlewares/auth-passport.middleware.js');

const cinemaRouter = express.Router();

cinemaRouter.get('/', async (req, res, next) => {
    try {
        const cinema = await Cinema.find().populate("movies");
        return res.status(200).json(cinema); 
    } catch (err) {
        next(err);
    }
});

cinemaRouter.post('/', [isAuthPassport], async (req, res, next) => {
    try { 
        const newCinema = new Cinema({ ...req.body });
        const createdCinema = await newCinema.save();
        return res.status(200).json(createdCinema);
    } catch (err) {
        next (err);
    }
});

cinemaRouter.put('/add-movie', [isAuthPassport], async (req, res, next) => {
    try {
        const { cinemaId, movieId } = req.body;
        if (!cinemaId) {
            return next(createError('Se necesita un id de cine válido para añadirlo', 500));
        }
        if (!movieId) {
            return next(createError('Se necesita un id de película válido para añadirlo', 500));
        }
        const updateCinema = await Cinema.findByIdAndUpdate(
            cinemaId,
            { $push: { movies: movieId }},
            { new:true }
        );
        res.status(200).json(updateCinema);
    } catch (err) {
        next(err);
    }
});

cinemaRouter.delete('/:id', [isAuthPassport], async (req, res, next) => {
    try {
        const id = req.params.id
        await Cinema.findByIdAndDelete(id);
        return res.status(200).json('El cine ha sido eliminado con exito.');
    } catch (err) {
        next(err);
    }
});

module.exports = cinemaRouter;