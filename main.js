const express = require('express');
const cors = require('cors');
const welcomeData = require('./welcome.js');

const { ANIME } = require('./APIconsumet/extensions');
const gogoanime = new ANIME.Gogoanime();


const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
    port: PORT, 
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', async (req, res) => {
    try {
      res.status(200).json(welcomeData);  	
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
});

app.get('/recent-released', async(request,reply)=>{
    functionWithQuery(gogoanime.fetchRecentEpisodes, request, reply);
});

app.get('/top-airing', async(request,reply)=>{
    functionWithQuery(gogoanime.fetchTopAiring, request, reply);
});

app.get('/popular', async(request,reply)=>{
    functionWithQuery(gogoanime.fetchPopularAnime, request, reply);   
});

app.get('/anime-movies', async(request,reply)=>{
    functionWithQuery(gogoanime.fetchAnimeMovies, request, reply);
});


app.get('/genres', async(request,reply)=>{

});
app.get('/genre/:type', async(request,reply)=>{

});

app.get('/info/:animeId', async(request,reply)=>{
    return functionWithParams(gogoanime.fetchAnimeInfo, request, reply);

});

app.get('/watch/:episodeId', async(request,reply)=>{
    return functionWithParams(gogoanime.fetchEpisodeSources, request, reply);
});
app.get('/servers/:episodeId', async(request,reply)=>{
    return functionWithParams(gogoanime.fetchEpisodeServers, request, reply);
});
app.get('/search/:data', async(request,reply)=>{
    return functionWithParams(gogoanime.search, request,reply);
});

async function functionWithParams(ParamsFunction, request, reply){
    const id = request.params.episodeId || request.params.animeId || request.params.data || request.params.type || null;
    if(id === null){
        return reply.status(404).json({"error": "Invalid last params"})
    }
    try{
        const jsonData = await ParamsFunction(id);
        reply.status(200).json(jsonData);
    }catch(err){
        console.error("Error while fetching: ",err);
    }
}

async function functionWithQuery(QueryFunction, request, reply){
    const page = request.query.p || 1;
    if(isNaN(page) || page == 0){
        return reply.status(200).json({"error": "Invalid Page Number"})
    }
    try{
        const jsonData = await QueryFunction(Number(page));
        reply.status(200).json(jsonData);
    }catch(err){
        console.error("Error while fetching: ",err);
    }
}


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

