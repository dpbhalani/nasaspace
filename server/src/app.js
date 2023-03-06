const express = require('express');

const path = require('path');

const cors = require('cors');
const api = require('./routes/api');

// const planetRoutes =require("../src/routes/planets/planets.route");
// const launchRoutes =require("../src/routes/launches/launches.route");

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..','public')));

// app.use('/planets', planetRoutes);
// app.use('/launches', launchRoutes);
//            versoning a api for nasa project ........
app.use('/v1',api);

app.get('/*' , (req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'))
})


module.exports = app;