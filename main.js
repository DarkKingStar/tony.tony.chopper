const fastify = require('fastify')({ 
    logger: true,
    http2: true,
    https: {
        allowHTTP1: true,
    },
    keepAliveTimeout: 10000 
});
const cors = require('cors');
const welcomeData = require('./welcome.js');
const { searchAnime, recentEpisodes, topAiring, popularAnime, animeMovies } = require('./src/animefetcher.js');
const { animeInfo } = require("./src/detailsfetcher.js");
const {episodeSources} = require("./src/streamfetcher.js");
const {fetchWithParams, fetchWithQuery}= require("./utils/helpers.js")

const PORT = process.env.PORT || 3000;

fastify.register(require('@fastify/cors'), { 
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
})

fastify.get('/', async (request, reply) => {
    try {
        reply.code(200).send(welcomeData);
    } catch (err) {
        reply.code(500).send({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
});

fastify.get('/recent-released', async(request,reply)=>{
    fetchWithQuery(recentEpisodes, request, reply);
});

fastify.get('/top-airing', async(request,reply)=>{
    fetchWithQuery(topAiring, request, reply);
});

fastify.get('/popular', async(request,reply)=>{
    fetchWithQuery(popularAnime, request, reply);   
});

fastify.get('/anime-movies', async(request,reply)=>{
    fetchWithQuery(animeMovies, request, reply);
});

fastify.get('/genres', async(request,reply)=>{
    reply.code(200).send({data:"not yet done"});
});

fastify.get('/genre/:type', async(request,reply)=>{
    reply.code(200).send({data:"not yet done"});
});

fastify.get('/info/:animeId', async(request,reply)=>{
    return fetchWithParams(animeInfo, request, reply);
});

fastify.get('/watch/:episodeId', async(request,reply)=>{
    return fetchWithParams(episodeSources, request, reply);
});

fastify.get('/servers/:episodeId', async(request,reply)=>{
    reply.code(200).send({data:"not yet done"});
    // return fetchWithParams(gogoanime.fetchEpisodeServers, request, reply);
});

fastify.get('/search/:data', async(request,reply)=>{
    return fetchWithParams(searchAnime, request, reply);
});

fastify.listen(PORT,'0.0.0.0', (err, address) => {
    if (err) throw err
    console.log(`server listening on http://localhost:${PORT}`)
});
