import express, {json} from "express";
import cors from 'cors';
import welcomeData from './welcome.js'
import dotenv from 'dotenv';

//fetcher import
import { fetchAnimeMovies, fetchPopularAnime, fetchRecentReleased, fetchTopAiring } from "./Fetcher/fetchAnimeList.js";
import handleFetchingListRoutes from "./Routes/handleFetchingListRoutes.js";
import handleFetchingInfoRoutes from "./Routes/handleFetchingInfoRoutes.js";


dotenv.config();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', // Allow requests from any origin
    credentials: true, // Allow credentials like cookies
    optionSuccessStatus: 200,
    port: PORT, // Set the port for CORS
};

const app = express();

app.use(cors(corsOptions));
app.use(json());

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


app.get('/recent-released', async (request,reply) =>{
    handleFetchingListRoutes(request, reply, fetchRecentReleased);
});
app.get('/top-airing', async (request,reply) =>{
    handleFetchingListRoutes(request, reply, fetchTopAiring);
});
app.get('/popular', async (request,reply) =>{
    handleFetchingListRoutes(request, reply, fetchPopularAnime);
});
app.get('/animemovies', async (request,reply) =>{
    handleFetchingListRoutes(request, reply, fetchAnimeMovies);
});


app.get('/info/:animeId', async(request,reply)=>{
    handleFetchingInfoRoutes(request, reply);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});