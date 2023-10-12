const axios = require('axios');
const url = "https://api.consumet.org/anime/gogoanime";

// Function to make a generic request to the API
const makeRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${url}/${endpoint}`, { params: { ...params, page: params.page || 1 } });
        return response.data;
    } catch (err) {
        console.error(`Error from API: ${err}`);
    }
};

// Function to fetch data for the homepage
const Home = async () => makeRequest('');

// Function to fetch recent releases
const Recent_Release = async (index) => makeRequest('recent-episodes', { type: 1, page: index });

// Function to fetch top airing anime
const Top_Airing = async (index) => makeRequest('top-airing', { type: 1, page: index });

// Function to perform a search
const Search = async (value) => makeRequest(value);

// Function to fetch information about a specific anime
const Anime_Info = async (animeId) => makeRequest(`info/${animeId}`);

// Function to watch a specific episode
const Watch = async (episodeId) => makeRequest(`watch/${episodeId}`);

// Function to get video servers for an episode
const V_Servers = async (episodeId) => makeRequest(`servers/${episodeId}`);


module.exports = {
    Home,           // Homepage
    Recent_Release, // Recent Releases
    Top_Airing,     // Top Airing
    Search,         // Search
    Anime_Info,     // Anime Information
    Watch,          // Watch Episode
    V_Servers       // Video Servers
};
