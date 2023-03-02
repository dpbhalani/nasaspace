const express = require('express');

const planetRoutes = express.Router();

const {
    httpGetAllPlanets,
} = require('../planets/planets.contreller');

planetRoutes.get('/', httpGetAllPlanets);


module.exports = planetRoutes;