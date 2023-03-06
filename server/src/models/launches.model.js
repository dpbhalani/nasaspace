const axios = require("axios");
const launchesDatabase = require('./launches.mongo');
const Planets = require('./planets.mongo');

const launches = new Map();

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

//let latestFlightNumber = 100;
let default_flightNumber = 100;
let launch = {
    flightNumber: 100,  //flight_Number
    mission: 'kepler exploration',  //name
    rocket: "Explore IS1",  //rocket.name
    launchDate: new Date('December 27,2025'), //date_local
    target: "Kepler-442 b", // not applicable
    customers: ["ZTM", "NASA"], //payload.costomers for each payload
    upcoming: true, //upcoming
    success: true, //success
}

async function loadLaunchData(){
     console.log("loadlaunchdata is started...");
     const response = await axios.post(SPACEX_API_URL, {
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:"rocket",
                    select:{
                        name:1
                    }
                },
                {
                    path : "payloads",
                    select : {
                        "costomers":1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;

    for (launchDoc of launchDocs){
            const payloads = launchDoc['payloads'];
            const customers = payloads.flatMap((payload) => {
                return payload["customers"]
            });

        const launch = {
            flightNumber:launchDoc["flight_number"],
            mission:launchDoc["name"],
            rocket:launchDoc["rocket"]["name"],
            launchDate:launchDoc["date_local"],
            upcoming:launchDoc["upcoming"],
            success:launchDoc["success"],
            customers,
        }
        console.log(`${launch.flightNumber} ${launch.mission}`);
    }
}

saveLaunch(launch);

launches.set(launch.flightNumber, launch);

 function getAllLaunches() {
    return  launchesDatabase.find({},{
        '_id':0 ,'__v':0,
    })
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             customers: ["Zero to Mastery", "NASA"],
//             upcoming: true,
//             success: true,
//             flightNumber: latestFlightNumber,
//         })
//     );
// }

async function existLaunchWithId(launchId){
   return await launchesDatabase.findOne({
    flightNumber : launchId,
   });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return default_flightNumber;
    }

    return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({
        flightNumber : launchId,
    },{
        upcoming : false,
        success : false,
    });

    return aborted.ok === 1 && aborted.nModified === 1; 
//    const aborted = launches.get(launchId);
//    aborted.upcoming = false;
//    aborted.success = false;
//    return aborted;
}

async function saveLaunch(launch){
    const planet = await Planets.findOne({
        keplerName : launch.target,
    })

    if(!planet){
        throw new Error("The selected planet is not found please select a valid planet");
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert:true,
    });
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch , {
        customers: ["Zero to Mastery", "NASA"],
        upcoming: true,
        success: true,
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

module.exports = {
    getAllLaunches,
    //addNewLaunch,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchById,
    loadLaunchData,
}