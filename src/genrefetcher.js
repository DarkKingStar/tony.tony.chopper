const cheerio = require('cheerio')
const axios = require('axios');

const baseUrl = 'https://anitaku.to';
const ajaxUrl = 'https://ajax.gogo-load.com/ajax';


const genreList  = async(page=1)=>{
    try{
        let results = [];
        const res = await axios.get(`${baseUrl}/home.html`);
        const $ = (0, cheerio.load)(res.data);
        $('nav.menu_series.genre.right > ul > li').each((i, el) => {
            results.push({
                title: $(el).find('a').text().trim(),
                id: $(el).find('a').attr('href').split("/")[2]
            })
        })
        return {results};
    }catch(err){
        console.log(err);
        return {error:"true", axios:err.message, message:'Something went wrong. Please try again later.'}
    }
}

const genreTypeAnimeList = async(id, page)=>{
    try{
        let genreType = []
        const res = await axios.get(`${baseUrl}/genre/${id}?page=${page}`);
        const $ = (0, cheerio.load)(res.data);
        $('div.last_episodes > ul > li').each((i, el) => {
            var _a;
            genreType.push({
                id: (_a = $(el).find('a:nth-child(1)').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2],
                title: $(el).find('a:nth-child(1)').text().trim(),
                status: $(el).find('p.released').text().trim(),
                image: $(el).find('div > a > img').attr('src'),
                subOrDub: $(el).find('p.name > a').text().toLowerCase().includes('dub')
                    ? 'dub'
                    : 'sub',
            });
        });
        const hasNextPage = $('div.anime_name.anime_movies > div > div > ul > li.selected').next().length > 0;
        return {
            currentPage: parseInt(page),
            hasNextPage: hasNextPage,
            results: genreType,
        };
    }catch(err){
        return {error:"true", axios:err.message, message:'Something went wrong. Please try again later.'}
    }
}

module.exports = {
    genreList,
    genreTypeAnimeList
}