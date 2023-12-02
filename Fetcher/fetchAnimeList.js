import animeMovies from "./AnimeList/animeMovies.js";
import popularAnime from "./AnimeList/popularAnime.js";
import recentReleased from "./AnimeList/recentReleased.js";
import topAiring from "./AnimeList/topAiring.js";

export const fetchTopAiring = async(pageNo) => {
    try {
        return await topAiring(pageNo);
      } catch (error) {
        console.error('Error fetching anime list :', error);
        return [{"error": error }];
    }
};

export const fetchRecentReleased = async(pageNo) => {
    try{
        return await recentReleased(pageNo);
    } catch (error) {
        console.error('Error fetching anime list :', error);
        return [{"error": error }];
    }
};

export const fetchPopularAnime = async(pageNo) => {
    try{
        return await popularAnime(pageNo);
    } catch (error) {
        console.error('Error fetching anime list :', error);
        return [{"error": error }];
    }
};

export const fetchAnimeMovies = async(pageNo) =>{
    try{
        return await animeMovies(pageNo)
    }catch (error) {
        console.error('Error fetching anime list :', error);
        return [{"error": error }];
    }
};

