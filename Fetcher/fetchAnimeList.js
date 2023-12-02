import animeMovies from "./AnimeList/animeMovies.js";
import popularAnime from "./AnimeList/popularAnime.js";
import recentReleased from "./AnimeList/recentReleased.js";
import topAiring from "./AnimeList/topAiring.js";

export const fetchTopAiring = async(pageNo) => {
   return await topAiring(pageNo);
};

export const fetchRecentReleased = async(pageNo) => {
    return await recentReleased(pageNo);
};

export const fetchPopularAnime = async(pageNo) => {
    return await popularAnime(pageNo);
};

export const fetchAnimeMovies = async(pageNo) =>{
    return await animeMovies(pageNo)
};

