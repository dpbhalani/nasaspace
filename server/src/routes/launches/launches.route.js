const express = require('express');
//const { httpAbortLaunch } = require('../../../../client/src/hooks/requests');

const launchRoutes = express.Router();

const { 
    httpGetAllLaunches,
    htttpAddnewLaunch,
    httpAbortLaunch,
} =require('./launches.controller');

launchRoutes.get("/",httpGetAllLaunches);
launchRoutes.post("/",htttpAddnewLaunch);
launchRoutes.delete("/:id",httpAbortLaunch);

module.exports = launchRoutes;