const http = require('http');

const mongoose =require('mongoose');

const MONGO_URL = "mongodb+srv://nasa-api-dharmik:QgmqEdA9vFSD4bA4@cluster0.eydnacb.mongodb.net/?retryWrites=true&w=majority";

const{ loadPlanetData } = require('./models/planets.model');
const{ loadLaunchData} = require('./models/launches.model');

const app = require('./app');

const PORT = process.env.PORT || 8000;

mongoose.connection.once('open', () => {
    //console.log("Mongo-db connection readdy");
});
mongoose.connection.on('error',(err)=>{
    console.log(err);
});

async function serverStart(){
    await mongoose.connect(MONGO_URL,{
        useNewUrlParser: true,
       // useFindAndModify:false,
       // useCreateIndex:true,
        useUnifiedTopology:true,
    });

    await loadPlanetData();
    await loadLaunchData();

const server = http.createServer(app);

server.listen(PORT , () => { 
    console.log(`Server listning at port ${PORT}....`);
})
};

serverStart();