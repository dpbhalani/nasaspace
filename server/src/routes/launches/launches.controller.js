const {
    getAllLaunches,
    //addNewLaunch,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req ,res){
    return res.status(200).json(await getAllLaunches());
}

async function htttpAddnewLaunch(req ,res){
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate ||!launch.target){
        return res.status(400).json({
            error:"misssing the your new launch detail..."
        })
    }
    
    launch.launchDate = new Date(launch.launchDate);
    
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Invalid the launch date ,please enter valid date.."
        })
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req ,res){
    //console.log(req.params.id);
    const launchId = Number(req.params.id);
    //console.log(existLaunchWithId(launchId))
     const existslaunch = await existLaunchWithId(launchId);
    if(!existslaunch){
        return res.status(404).json({
            error : "launch is not found..",
        });
    }

    const aborted = abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.status(200).json({
       ok :true,
    });
}

module.exports = {
    httpGetAllLaunches,
    htttpAddnewLaunch,
    httpAbortLaunch,
} 