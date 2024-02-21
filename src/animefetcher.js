const cheerio = require('cheerio')
const axios = require('axios');
const { animeInfo } = require('./detailsfetcher');



const baseUrl = 'https://anitaku.to/';
const ajaxUrl = 'https://ajax.gogo-load.com/ajax';



const searchAnime = async(query, page=1) =>{
    const searchResult = {
        currentPage: page,
        hasNextPage: false,
        results: [],
    };
    try {
        const res = await axios.get(`${baseUrl}/search.html?keyword=${encodeURIComponent(query)}&page=${page}`);
        const $ = (0, cheerio.load)(res.data);
        searchResult.hasNextPage =
            $('div.anime_name.new_series > div > div > ul > li.selected').next().length > 0;
        $('div.last_episodes > ul > li').each(async(i, el) => {
            var _a;
            searchResult.results.push({
                id: (_a = $(el).find('p.name > a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2],
                title: $(el).find('p.name > a').text().trim(),
                url: `${baseUrl}/${$(el).find('p.name > a').attr('href')}`,
                image: $(el).find('div > a > img').attr('src'),
                releaseDate: $(el).find('p.released').text().trim(),
                subOrDub: $(el).find('p.name > a').text().toLowerCase().includes('dub')
                    ? 'dub'
                    : 'sub',
            });
        });
        return searchResult;
    }
    catch (err) {
        return {error:"true", axios:err.message, message:"Invalid search text, no Anime found"}
    }
}

const recentEpisodes = async(type=1,page=1) =>{
    try {
        const res = await axios.get(`${baseUrl}/home.html?page=${page}&type=${type}`);
        const $ = (0, cheerio.load)(res.data);
        const recentEpisodes = [];
        $('div.last_episodes.loaddub > ul > li').each((i, el) => {
            var _a, _b, _c, _d;
            recentEpisodes.push({
                id: (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[1]) === null || _b === void 0 ? void 0 : _b.split('-episode')[0],
                episodeId: (_c = $(el).find('a').attr('href')) === null || _c === void 0 ? void 0 : _c.split('/')[1],
                episodeNumber: parseInt($(el).find('p.episode').text().replace('Episode ', '')),
                title: $(el).find('p.name > a').text().trim(),
                image: $(el).find('div > a > img').attr('src'),
            });
        });
        const hasNextPage = !$('div.anime_name_pagination.intro > div > ul > li').last().hasClass('selected');
        return {
            currentPage: page,
            hasNextPage: hasNextPage,
            results: recentEpisodes,
        };
    }
    catch (err) {
        return {error:"true", axios:err.message, message:'Something went wrong. Please try again later.'}
    }
}

const topAiring = async (page = 1) => {
    try {
        const res = await axios.get(`${ajaxUrl}/page-recent-release-ongoing.html?page=${page}`);
        const $ = (0, cheerio.load)(res.data);
        const topAiring = [];
        $('div.added_series_body.popular > ul > li').each((i, el) => {
            var _a, _b;
            topAiring.push({
                id: (_a = $(el).find('a:nth-child(1)').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2],
                title: $(el).find('a:nth-child(1)').text().trim(),
                image: (_b = $(el).find('a:nth-child(1) > div').attr('style')) === null || _b === void 0 ? void 0 : _b.match('(https?://.*.(?:png|jpg))')[0],
            });
        });
        const hasNextPage = !$('div.anime_name.comedy > div > div > ul > li').last().hasClass('selected');
        return {
            currentPage: page,
            hasNextPage: hasNextPage,
            results: topAiring,
        };
    }
    catch (err) {
        return {error:"true", axios:err.message, message:'Something went wrong. Please try again later.'}
    }
};


const popularAnime = async (page = 1,type = 1) => {
    try {
        const res = await axios.get(`${baseUrl}/popular.html?page=${page}&type=${type}`);
        const $ = (0, cheerio.load)(res.data);
        const popularAnime = [];
        $('div.last_episodes > ul > li').each((i, el) => {
            var _a, _b, _c, _d;
            popularAnime.push({
                id: (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]) === null || _b === void 0 ? void 0 : _b.split('-episode')[0],
                released: $(el).find('p.released').text().replace('Released: ', '').replace('\n','').trim(),
                title: $(el).find('p.name > a').text().trim(),
                image: $(el).find('div > a > img').attr('src'),
            });
        });
        const hasNextPage = !$('div.anime_name_pagination > div > ul > li').last().hasClass('selected');
        return {
            currentPage: page,
            hasNextPage: hasNextPage,
            results: popularAnime,
        };
    }
    catch (err) {
        return {error:"true", axios:err.message, message:'Something went wrong. Please try again later.'}
    }
};


const animeMovies = async (page = 1,type = 1) => {
    try {
        const res = await axios.get(`${baseUrl}/anime-movies.html?page=${page}&type=${type}`);
        const $ = (0, cheerio.load)(res.data);
        const animeMovies = [];
        $('div.last_episodes > ul > li').each((i, el) => {
            var _a, _b, _c, _d;
            animeMovies.push({
                id: (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]) === null || _b === void 0 ? void 0 : _b.split('-episode')[0],
                released: $(el).find('p.released').text().replace('Released: ', '').replace('\n','').trim(),
                title: $(el).find('p.name > a').text().trim(),
                image: $(el).find('div > a > img').attr('src'),
            });
        });
        const hasNextPage = !$('div.anime_name_pagination > div > ul > li').last().hasClass('selected');
        return {
            currentPage: page,
            hasNextPage: hasNextPage,
            results: animeMovies,
        };
    }
    catch (err) {
        return {error:"true", axios:err.message, message:'Something went wrong. Please try again later.'}
    }
};


module.exports = {
    searchAnime,
    recentEpisodes,
    topAiring,
    popularAnime,
    animeMovies
};
