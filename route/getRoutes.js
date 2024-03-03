const { searchAnime, recentEpisodes, newSeason, popularAnime, animeMovies } = require('../src/Extractor/animefetcher.js');
const { animeInfo } = require("../src/Extractor/detailsfetcher.js");
const {episodeSources} = require("../src/Extractor/streamfetcher.js");
const { genreList, genreTypeAnimeList, animeScheduleList } = require('../src/Extractor/otherfetcher.js');
const {fetchWithParams, fetchWithQuery}= require("../utils/helpers.js");

const getRoutes = [
    {
        route: '/recent-released',
        fetchFunction: fetchWithQuery,
        fetcher: recentEpisodes
    },
    {
        route: '/new-season',
        fetchFunction: fetchWithQuery,
        fetcher: newSeason
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