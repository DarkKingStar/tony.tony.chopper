const express = require('express');
const cors = require('cors');
const Api = require('./api-parser');

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', // Allow requests from any origin
    credentails: true, // Allow credentials like cookies
    optionSuccessStatus: 200,
    port: PORT, // Set the port for CORS
};

const app = express();

app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Function to handle routes and return JSON data
const handleRoute = async (req, res, apiFunction) => {
    try {
        const data = await apiFunction(req.query.q || 1); // Use 'q' as a default query parameter
        res.status(200).json(data); // Send JSON response with data
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
};

// Define routes

// Home route
app.get('/', async (req, res) => {
    handleRoute(req, res, Api.Home); // Call handleRoute with Home API function
});

// Recent release route
app.get('/recent-release', async (req, res) => {
    handleRoute(req, res, Api.Recent_Release); // Call handleRoute with Recent_Release API function
});

// Top airing route
app.get('/top-airing', async (req, res) => {
    handleRoute(req, res, Api.Top_Airing); // Call handleRoute with Top_Airing API function
});

// Anime search route
app.get('/anime', async (req, res) => {
    handleRoute(req, res, Api.Search); // Call handleRoute with Search API function
});

// Anime info route
app.get('/info', async (req, res) => {
    handleRoute(req, res, Api.Anime_Info); // Call handleRoute with Anime_Info API function
});

// Watch route
app.get('/watch', async (req, res) => {
    handleRoute(req, res, Api.Watch); // Call handleRoute with Watch API function
});

// Server route
app.get('/server', async (req, res) => {
    handleRoute(req, res, Api.V_Servers); // Call handleRoute with V_Servers API function
});
//random anime character image route
app.get("/character", async(req,res)=>{
    try {
        const data = await Api.CharacterImage();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
