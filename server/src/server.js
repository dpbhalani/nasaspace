const http = require('http');

const{ loadPlanetData } = require('./models/planets.model');

const app = require('./app');

const PORT = process.env.PORT || 8000;

async function serverStart(){
    await loadPlanetData();

const server = http.createServer(app);

server.listen(PORT , () => { 
    console.log(`Server listning at port ${PORT}....`);
})
};

serverStart();