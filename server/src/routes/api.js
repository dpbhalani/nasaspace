const express = require("express");

const planetRoutes =require("./planets/planets.route");
const launchRoutes =require("./launches/launches.route");

const api = express.Router();


api.use('/planets', planetRoutes);
api.use('/launches', launchRoutes);


module.exports = api;