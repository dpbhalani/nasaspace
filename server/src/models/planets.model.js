const { rejects } = require('assert');
const path = require('path');
const { parse } = require('csv-parse');

const fs = require('fs');
const { resolve } = require('path');

const habitableplanets = [];

function ishabitable(planet){
    return planet ['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol']<1.11
    &&planet['koi_prad'] < 1.6
}

function loadPlanetData (){
    return new Promise((resolve , rejects) =>{
    fs.createReadStream(path.join(__dirname,'..','..','data','neo.csv'))
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on('data',(data) => {
        if(ishabitable(data)){
            habitableplanets.push(data);
        }
    })
    .on('error',(err) => {
        console.log(err);
        rejects(err);
    })
    .on('end',() => {
        console.log(`${habitableplanets.length} habitableplanet is found...!`);
        resolve();
        });
    });
}

function getAllPlanets(){
    return habitableplanets;
}


module.exports = {
    loadPlanetData,
    getAllPlanets,
};