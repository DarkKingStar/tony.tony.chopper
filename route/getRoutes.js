const { searchAnime, recentEpisodes, topAiring, popularAnime, animeMovies } = require('../src/animefetcher.js');
const { animeInfo } = require("../src/detailsfetcher.js");
const {episodeSources} = require("../src/streamfetcher.js");
const {fetchWithParams, fetchWithQuery}= require("../utils/helpers.js");
const { genreList, genreTypeAnimeList, animeScheduleList } = require('../src/otherfetcher.js');

const getRoutes = [
    {
        route: '/recent-released',
        fetchFunction: fetchWithQuery,
        fetcher: recentEpisodes
    },
    {
        route: '/top-airing',
        fetchFunction: fetchWithQuery,
        fetcher: topAiring
    },
    {
        route: '/popular',
        fetchFunction: fetchWithQuery,
        fetcher: popularAnime
    },
    {
        route: '/anime-movies',
        fetchFunction: fetchWithQuery,
        fetcher: animeMovies
    },
    {
        route: '/genres',
        fetchFunction: fetchWithQuery,
        fetcher: genreList
    },
    {
        route: '/schedule',
        fetchFunction: fetchWithQuery,
        fetcher: animeScheduleList
    },
    {
        route: '/genre/:type',
        fetchFunction: fetchWithParams,
        fetcher: genreTypeAnimeList
    },
    {
        route: '/info/:animeId',
        fetchFunction: fetchWithParams,
        fetcher: animeInfo
    },
    {
        route: '/watch/:episodeId',
        fetchFunction: fetchWithParams,
        fetcher: episodeSources
    },
    {
        route: '/search/:data',
        fetchFunction: fetchWithParams,
        fetcher: searchAnime
    },
];

module.exports={
    getRoutes
}