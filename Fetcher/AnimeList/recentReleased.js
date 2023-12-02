import { load } from "cheerio";
import request from "request";
import { BASE_URL } from "../../Routes/parser.js";


async function recentReleased(page){
    return new Promise((resolve, reject) => {
        try {
            const recentReleasedData = [];
            let url = `${BASE_URL}/home.html?page=${page}`;
            
            request(url, (err, resp, html) => {
                if (err) {
                    reject(err);
                    return;
                }
                var $ = load(html);
                $('div.last_episodes.loaddub > ul > li').each((i, el) => {
                    var _a, _b, _c, _d;
                    recentReleasedData.push({
                        id: (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[1]) === null || _b === void 0 ? void 0 : _b.split('-episode')[0],
                        episodeId: (_c = $(el).find('a').attr('href')) === null || _c === void 0 ? void 0 : _c.split('/')[1],
                        episodeNumber: parseInt($(el).find('p.episode').text().replace('Episode ', '')),
                        title: $(el).find('p.name > a').text().trim(),
                        image: $(el).find('div > a > img').attr('src'),
                        url: `${BASE_URL}${(_d = $(el).find('a').attr('href')) === null || _d === void 0 ? void 0 : _d.trim()}`,
                    });
                });
                const hasNextPage = !$('div.anime_name_pagination.intro > div > ul > li').last().hasClass('selected');
                resolve({
                    currentPage: page,
                    hasNextPage: hasNextPage,
                    results: recentReleasedData,
                });
            });

        }catch(err){
            reject(err);
        }
    });
}
export default recentReleased;