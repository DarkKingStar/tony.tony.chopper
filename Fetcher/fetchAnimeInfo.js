import { load } from "cheerio";
import request from "request";
import { BASE_URL } from "../Routes/parser.js";

async function fetchAnimeInfo(id){
    return new Promise((resolve,reject)=>{
        try{
            const animeInfo = {
                id: '',
                title: '',
                url: '',
                genres: [],
                totalEpisodes: 0,
            };
            let url = `${BASE_URL}/category/${id}`;
            request(url, async(err, resp, html) => {
                if (err) {
                    reject(err);
                    return;
                }
                var $ = load(html);
                animeInfo.id = id;
                animeInfo.title = $('section.content_left > div.main_body > div:nth-child(2) > div.anime_info_body_bg > h1').text().trim();
                animeInfo.url = `${BASE_URL}/category/${id}`;
                animeInfo.image = $('div.anime_info_body_bg > img').attr('src');
                animeInfo.releaseDate = $('div.anime_info_body_bg > p:nth-child(7)').text().trim().split('Released: ')[1];
                animeInfo.description = $('div.anime_info_body_bg > p:nth-child(5)').text().trim().replace('Plot Summary: ', '');
                animeInfo.subOrDub = animeInfo.title.toLowerCase().includes('dub') ? 'DUB' : 'SUB';
                animeInfo.type = $('div.anime_info_body_bg > p:nth-child(4) > a').text().trim().toUpperCase();
                animeInfo.status = $('div.anime_info_body_bg > p:nth-child(8) > a').text().trim() || 'Unknown';
                animeInfo.otherName = $('div.anime_info_body_bg > p:nth-child(9)').text().replace('Other name: ', '').replace(/;/g, ',');
                $('div.anime_info_body_bg > p:nth-child(6) > a').each((i, el) => {
                    var _a;
                    (_a = animeInfo.genres) === null || _a === void 0 ? void 0 : _a.push($(el).attr('title').toString());
                });
                const ep_start = $('#episode_page > li').first().find('a').attr('ep_start');
                const ep_end = $('#episode_page > li').last().find('a').attr('ep_end');
                const movie_id = $('#movie_id').attr('value');
                const alias = $('#alias_anime').attr('value');
                const url1 = `${BASE_URL}/load-list-episode?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`;
                animeInfo.episodes = await getAnimeEpisodesList(url1);
                animeInfo.totalEpisodes = parseInt(ep_end !== null && ep_end !== void 0 ? ep_end : '0');
                resolve(animeInfo);
            });

        }catch(err){
            console.log(err)
            reject(err);
        }
    });
}

async function getAnimeEpisodesList(url){
    return new Promise((resolve,reject)=>{
        try{
            let episodes = [];
            request(url, (err, resp, html) => {
                if (err) {
                    reject(err);
                    return;
                }
                var $ = load(html);
                $('#episode_related > li').each((i, el) => {
                    var _a, _b, _c;
                    (_a = episodes) === null || _a === void 0 ? void 0 : _a.push({
                        id: (_b = $(el).find('a').attr('href')) === null || _b === void 0 ? void 0 : _b.split('/')[1],
                        number: parseFloat($(el).find(`div.name`).text().replace('EP ', '')),
                        url: `${BASE_URL}${(_c = $(el).find(`a`).attr('href')) === null || _c === void 0 ? void 0 : _c.trim().slice(1)}`,
                    });
                });
                episodes = episodes.reverse();
                resolve(episodes);
            });
        }catch(err){
            console.log(err);
            reject(err)
        }
    })
}




export default fetchAnimeInfo