const launchesDatabase = require('./launches.mongo');

const launches = new Map();

latestFlightNumber = 100;
let launch = {
    flightNumber: 100,
    mission: 'kepler exploration',
    rocket: "Explore IS1",
    launchDate: new Date('December 27,2025'),
    target: "kepler-442 b",
    customer: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
}

saveLaunch(launch);

launches.set(launch.flightNumber, launch);

 function getAllLaunches() {
    return  launchesDatabase.find({},{
        '_id':0 ,'__v':0,
    })
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            customer: ["Zero to Mastery", "NASA"],
            upcoming: true,
            success: true,
            flightNumber: latestFlightNumber,
        })
    );
}

function existLaunchWithId(launchId){
   return launches.has(launchId);
}

function abortLaunchById(launchId){
   const aborted = launches.get(launchId);
   aborted.upcoming = false;
   aborted.success = false;
   return aborted;
}

async function saveLaunch(launch){
    await launchesDatabase.updateOne({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert:true,
    });
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById,
}