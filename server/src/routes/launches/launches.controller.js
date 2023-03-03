const {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req ,res){
    return res.status(200).json(await getAllLaunches());
}

function htttpAddnewLaunch(req ,res){
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
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req ,res){
    //console.log(req.params.id);
    const launchId = Number(req.params.id);
    //console.log(existLaunchWithId(launchId))

    if(!existLaunchWithId(launchId)){
        return res.status(404).json({
            error : "launch is not found.."
        });
    }

    const aborted = abortLaunchById(launchId);
    //console.log(aborted);
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    htttpAddnewLaunch,
    httpAbortLaunch,
} 