const { rejects } = require('assert');
const path = require('path');
const { parse } = require('csv-parse');

const Planets = require("./planets.mongo");

const fs = require('fs');
const { resolve } = require('path');

const habitableplanets = [];

function ishabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

function loadPlanetData() {
    return new Promise((resolve, rejects) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'neo.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (ishabitable(data)) {
                    //Todo: change the create with update+insert=upsert ;
                   savePlanets(data);
                    //habitableplanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                rejects(err);
            })
            .on('end', async () => {
                const countsPlanetsFound =(await getAllPlanets()).length;
                console.log(`${countsPlanetsFound} habitableplanet is found...!`);
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await Planets.find({});
}
async function savePlanets(planets){
   try{
    await Planets.updateOne({
        keplerName: planets.kepler_name,
    },{
        keplerName: planets.kepler_name,
    },
    {
        upsert: true,
    });
   }catch(err){
    console.error("Planet not found...")
   }
}

 
module.exports = {
    loadPlanetData,
    getAllPlanets,
};