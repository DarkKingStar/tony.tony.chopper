const express = require('express');
const cors = require('cors');
const welcomeData = require('./welcome.js');
const { searchAnime, recentEpisodes, topAiring, popularAnime, animeMovies } = require('./src/animefetcher.js');
const { animeInfo } = require("./src/detailsfetcher.js");
const {episodeSources} = require("./src/streamfetcher.js");
const {fetchWithParams, fetchWithQuery}= require("./utils/helpers.js")


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
    fetchWithQuery(recentEpisodes, request, reply);
});

app.get('/top-airing', async(request,reply)=>{
    fetchWithQuery(topAiring, request, reply);
});

app.get('/popular', async(request,reply)=>{
    fetchWithQuery(popularAnime, request, reply);   
});

app.get('/anime-movies', async(request,reply)=>{
    fetchWithQuery(animeMovies, request, reply);
});


app.get('/genres', async(request,reply)=>{
    reply.status(200).json({data:"not yet done"});

});
app.get('/genre/:type', async(request,reply)=>{
    reply.status(200).json({data:"not yet done"});
});

app.get('/info/:animeId', async(request,reply)=>{
    return fetchWithParams(animeInfo, request, reply);
});

app.get('/watch/:episodeId', async(request,reply)=>{
    return fetchWithParams(episodeSources, request, reply);
});
app.get('/servers/:episodeId', async(request,reply)=>{
    reply.status(200).json({data:"not yet done"});
    // return fetchWithParams(gogoanime.fetchEpisodeServers, request, reply);
});
app.get('/search/:data', async(request,reply)=>{
    return fetchWithParams(searchAnime, request, reply);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

