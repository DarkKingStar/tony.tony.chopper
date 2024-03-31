const cheerio = require("cheerio");
const axios = require("axios");
const _ = require("lodash");
const { removeDuplicateInList,getGlobalTimeFromJST } = require("../../utils/helpers");
const { searchAnime } = require("./animefetcher");

const baseUrl = "https://anitaku.to";
const ajaxUrl = "https://ajax.gogocdn.net/";

const genreList = async (page = 1) => {
  try {
    let results = [];
    const res = await axios.get(`${baseUrl}/home.html`);
    const $ = (0, cheerio.load)(res.data);
    $("nav.menu_series.genre.right > ul > li").each((i, el) => {
      results.push({
        title: $(el).find("a").text().trim(),
        id: $(el).find("a").attr("href").split("/")[2],
      });
    });
    return { results };
  } catch (err) {
    console.log(err);
    return {
      error: "true",
      axios: err.message,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const genreTypeAnimeList = async (id, page) => {
  try {
    let genreType = [];
    const res = await axios.get(`${baseUrl}/genre/${id}?page=${page}`);
    const $ = (0, cheerio.load)(res.data);
    $("div.last_episodes > ul > li").each((i, el) => {
      var _a;
      genreType.push({
        id:
          (_a = $(el).find("a:nth-child(1)").attr("href")) === null ||
          _a === void 0
            ? void 0
            : _a.split("/")[2],
        title: $(el).find("a:nth-child(1)").text().trim(),
        status: $(el).find("p.released").text().trim(),
        image: $(el).find("div > a > img").attr("src"),
        subOrDub: $(el).find("p.name > a").text().toLowerCase().includes("dub")
          ? "dub"
          : "sub",
      });
    });
    const hasNextPage =
      $("div.anime_name.anime_movies > div > div > ul > li.selected").next()
        .length > 0;
    return {
      currentPage: parseInt(page),
      hasNextPage: hasNextPage,
      results: genreType,
    };
  } catch (err) {
    return {
      error: "true",
      axios: err.message,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const animeScheduleList = async (page = 1) => {
  try {
    const today = new Date().getDay();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const day = daysOfWeek[today];
    const animeList = await fetchAnimeListbyDay([], day, 1);
    if (_.isEmpty(animeList)) {
      throw new Error("No data Found.");
    }
    const animeListWithoutDuplicate = removeDuplicateInList(animeList);
    const animeListSorted = animeListWithoutDuplicate.sort((a, b) => {
        let timeA = a.broadcastTime.split(':').map(Number);
        let timeB = b.broadcastTime.split(':').map(Number);
      
        // Compare hours first
        if (timeA[0] < timeB[0]) return -1;
        if (timeA[0] > timeB[0]) return 1;
      
        // If hours are equal, compare minutes
        if (timeA[1] < timeB[1]) return -1;
        if (timeA[1] > timeB[1]) return 1;
      
        return 0;  // If both hours and minutes are equal
      });
    return {
      day: day,
      count: animeListSorted?.length || 0,
      results: animeListSorted,
    };
  } catch (err) {
    return {
      error: true,
      axios: err.message,
      message: "Please try again later",
    };
  }
};

const fetchAnimeListbyDay = async (list, day, page) => {
  try {
    const res = await axios.get(
      `https://api.jikan.moe/v4/schedules?kids=false&sfw=true&filter=${day}&page=${page}`
    );

    if (res.status === 200) {
      const animePromises = res.data.data.map(async (item) => {
        const duration = item?.duration?.split(" ")[0];
        if (!isNaN(duration) && parseInt(duration) >= 10) {
          let genre = [];
          item.genres.forEach((gitem) => {
            genre.push(gitem?.name);
          });
          try {
            const searchInGogo = await searchAnime(
              item?.titles[1]?.title,
              page
            );
            const GlobalTime = getGlobalTimeFromJST(item?.broadcast?.time)
            list.push({
              mal_id:item?.mal_id,
              id: searchInGogo?.results[0]?.id || "",
              title: item?.title,
              otherTitle: item?.titles[1]?.title,
              image: item?.images?.jpg?.image_url,
              status: item?.status,
              genre: genre,
              broadcast: item?.broadcast?.string,
              broadcastTime: item?.broadcast?.time,
              localeTime: GlobalTime,
              duration: item?.duration,
            });
          } catch (error) {
            console.log(error.message);
          }
        }
      });

      await Promise.all(animePromises);

      if (res?.data?.pagination?.has_next_page === true) {
        let nextpage = parseInt(page) + 1;
        return fetchAnimeListbyDay(list, day, nextpage);
      }

      return list;
    } else {
      throw new Error("Failed to fetch data from API");
    }
  } catch (err) {
    console.log(err.message);
    throw err; // Propagate the error to the caller
  }
};

module.exports = {
  genreList,
  genreTypeAnimeList,
  animeScheduleList,
};
