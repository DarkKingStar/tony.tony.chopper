import { load } from "cheerio";
import request from "request";
import { BASE_URL } from "../../Routes/parser.js";


async function animeMovies(page){
    return new Promise((resolve, reject) => {
        try {
            const animeMoviesData = [];
            let url = `${BASE_URL}/anime-movies.html?page=${page}`;
            
            request(url, (err, resp, html) => {
                if (err) {
                    reject(err);
                    return;
                }
                var $ = load(html);
                $('div.last_episodes > ul > li').each((i, el) => {
                    var _a, _b, _c, _d;
                    animeMoviesData.push({
                        id: (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2]) === null || _b === void 0 ? void 0 : _b.split('-episode')[0],
                        released: $(el).find('p.released').text().replace('Released: ', '').replace('\n','').trim(),
                        title: $(el).find('p.name > a').attr('title'),
                        image: $(el).find('div > a > img').attr('src'),
                        url: `${BASE_URL}${(_d = $(el).find('a').attr('href')) === null || _d === void 0 ? void 0 : _d.trim()}`,
                    });
                });
                const hasNextPage = !$('div.anime_name_pagination.intro > div > ul > li').last().hasClass('selected');
                resolve({
                    currentPage: page,
                    hasNextPage: hasNextPage,
                    results: animeMoviesData,
                });
            });

        }catch(err){
            reject(err);
        }
    });
}
export default animeMovies;