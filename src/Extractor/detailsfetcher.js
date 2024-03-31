const cheerio = require('cheerio')
const axios = require('axios');



const baseUrl = 'https://anitaku.to';
const ajaxUrl = 'https://ajax.gogocdn.net/ajax';


const animeInfo = async (id) => {
    console.log("id:",id);
    id = `${baseUrl}/category/${id}`;
    const animeInfo = {
        id: '',
        title: '',
        url: '',
        genres: [],
        totalEpisodes: 0,
    };
    try {
        const res = await axios.get(id);
        const $ = (0, cheerio.load)(res.data);
        animeInfo.id = new URL(id).pathname.split('/')[2];
        animeInfo.title = $('section.content_left > div.main_body > div:nth-child(2) > div.anime_info_body_bg > h1')
            .text()
            .trim();
        animeInfo.url = id;
        animeInfo.image = $('div.anime_info_body_bg > img').attr('src');
        animeInfo.releaseDate = $('div.anime_info_body_bg > p:nth-child(8)')
            .text()
            .trim()
            .split('Released: ')[1];
        animeInfo.description = $('div.anime_info_body_bg > div.description').text();
        animeInfo.subOrDub = animeInfo.title.toLowerCase().includes('dub') ? 'dub' : 'sub';
        animeInfo.type = $('div.anime_info_body_bg > p:nth-child(4) > a')
            .text()
            .trim()
            .toUpperCase();
        animeInfo.status = $('div.anime_info_body_bg > p:nth-child(9) > a')
            .text()
            .trim();
        animeInfo.otherName = $('div.anime_info_body_bg > p:nth-child(10) > a')
            .text()
            .replace('Other name: ', '')
            .trim()
            .replace(/;/g, ',');
        $('div.anime_info_body_bg > p:nth-child(7) > a').each((i, el) => {
            var _a;
            (_a = animeInfo.genres) === null || _a === void 0 ? void 0 : _a.push($(el).attr('title').toString());
        });
        const ep_start = $('#episode_page > li').first().find('a').attr('ep_start');
        const ep_end = $('#episode_page > li').last().find('a').attr('ep_end');
        const movie_id = $('#movie_id').attr('value');
        const alias = $('#alias_anime').attr('value');
        const html = await axios.get(`${ajaxUrl}/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`);
        // console.log(`${ajaxUrl}/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`);
        const $$ = (0, cheerio.load)(html.data);
        animeInfo.episodes = [];
        $$('#episode_related > li').each((i, el) => {
            var _a, _b, _c;
            (_a = animeInfo.episodes) === null || _a === void 0 ? void 0 : _a.push({
                id: (_b = $(el).find('a').attr('href')) === null || _b === void 0 ? void 0 : _b.split('/')[1],
                number: parseFloat($(el).find(`div.name`).text().replace('EP ', '')),
            });
        });
        animeInfo.episodes = animeInfo.episodes.reverse();
        animeInfo.totalEpisodes = parseInt(ep_end !== null && ep_end !== void 0 ? ep_end : '0');
        return animeInfo;
       
    }
    catch (err) {
        return {error:"true", axios:err.message, message:"Invalid Anime Id or Anime not found"}
    }
};


module.exports = {
    animeInfo
};