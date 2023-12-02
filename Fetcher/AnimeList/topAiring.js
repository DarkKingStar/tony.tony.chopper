import { load } from "cheerio";
import request from "request";
import { BASE_URL } from "../../Routes/parser.js";

async function topAiring(page) {
    return new Promise((resolve, reject) => {
        try {
            const topAiringData = [];
            let url = `${BASE_URL}/page-recent-release-ongoing.html?page=${page}`;
            
            request(url, (err, resp, html) => {
                if (err) {
                    reject(err);
                    return;
                }
                var $ = load(html);
                $('div.added_series_body.popular > ul > li').each((i, el) => {
                    var _a, _b;
                    topAiringData.push({
                        id: (_a = $(el).find('a:nth-child(1)').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[2],
                        title: $(el).find('a:nth-child(1)').attr('title'),
                        image: (_b = $(el).find('a:nth-child(1) > div').attr('style')) === null || _b === void 0 ? void 0 : _b.match('(https?://.*.(?:png|jpg))')[0],
                        url: `${BASE_URL}${$(el).find('a:nth-child(1)').attr('href')}`,
                        genres: $(el)
                            .find('p.genres > a')
                            .map((i, el) => $(el).attr('title'))
                            .get(),
                    });
                });

                const hasNextPage = !$('div.anime_name.comedy > div > div > ul > li').last().hasClass('selected');
                
                resolve({
                    currentPage: page,
                    hasNextPage: hasNextPage,
                    results: topAiringData,
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

export default topAiring;
