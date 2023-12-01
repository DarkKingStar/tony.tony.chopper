const express = require('express');
const cors = require('cors');
const cheerio = require("cheerio");
const rs = require("request");
const { ANIME } = require('@consumet/extensions');

const baseURL = "https://anitaku.to/";
const gogoanime = new ANIME.Gogoanime();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', // Allow requests from any origin
    credentials: true, // Allow credentials like cookies
    optionSuccessStatus: 200,
    port: PORT, // Set the port for CORS
};

const app = express();

app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Define routes

// Home route
app.get('/', async (req, res) => {
  // handleRoute(req, res, Api.Home); // Call handleRoute with Home API function
  try {
    res.status(200).json({  	
        intro:	"Welcome to the anitaku(gogoanime) provider: check out the provider's website @ https://anitaku.to/",
        routes:	
        [
          "/anime?q='SearchText'",
          "/info?i='id'",
          "/watch?epid='episodeId'",
          "/servers",
          "/top-airing",
          "/recent-release",
          "/popular",
          "/animemovies",
          "/genrelist",
          "/genre/:type",
        ],
        github: "All Infomation is provided in the github repo: https://github.com/DarkKingStar/tony.tony.chopper"
    });
      } catch (err) {
          res.status(500).json({
              status: 500,
              error: 'Internal Error',
              message: err,
          });
      }
});

// Recent release route
app.get('/recent-release', async (req, res) => {
    // handleRoute(req, res, Api.Recent_Release); // Call handleRoute with Recent_Release API function
});

// Top airing route
app.get('/top-airing', async (req, res) => {
    // handleRoute(req, res, Api.Top_Airing); // Call handleRoute with Top_Airing API function
});

// Anime search route
app.get('/anime', async (req, res) => {
    // handleRoute(req, res, Api.Search); // Call handleRoute with Search API function
});

// Anime info route
app.get('/info', async (req, res) => {
    // handleRoute(req, res, Api.Anime_Info); // Call handleRoute with Anime_Info API function
});

// Watch route
app.get('/watch', async (request, reply) => {
  const episodeId = request.query.e;
  const server = request.query.q.toLowerCase();
  try {
    const res = await gogoanime
      .fetchEpisodeSources(episodeId, server)
      .catch((err) => reply.status(404).json({ message: err }));

    reply.status(200).json(res);
  } catch (err) {
    reply
      .status(500)
      .json({ message: 'Something went wrong. Please try again later.' });
  }
}
);

// Server route
app.get('/server', async (req, res) => {
    handleRoute(req, res, Api.V_Servers); // Call handleRoute with V_Servers API function
});

app.get("/genrelist", (request, reply) => {
    var list = [];
  
    let url = `${baseURL}/home.html`;
    rs(url, (err, resp, html) => {
      if (!err) {
        try {
          var $ = cheerio.load(html);
          $("nav.genre")
            .children("ul")
            .children("li")
            .each(function (index, element) {
              list[index] = $(this).text();
            });
  
          reply.status(200).json({ list });
        } catch (e) {
          reply.status(404).json({ e: "404 Error" });
        }
      }
    });
  });
  app.get("/genre/:type", (request, reply) => {
    var results = [];
    var type = request.params.type;
    var page = request.query.q || 1; 
    if (isNaN(page)) {
      return res.status(404).json({ results });
    }
    url = `${baseURL}/genre/${type}?page=${page}`;
    rs(url, (err, resp, html) => {
      if (!err) {
        try {
          var $ = cheerio.load(html);
          $(".img").each(function (index, element) {
            let title = $(this).children("a").attr().title;
            let id = $(this).children("a").attr().href.slice(10);
            let image = $(this).children("a").children("img").attr().src;
            let href = "/info/"+id
            results[index] = { title, id, image, href };
          });
  
          reply.status(200).json({ results });
        } catch (e) {
          reply.status(404).json({ e: "404 Error" });
        }
      }
    });
  });
  app.get("/popular", (request, reply) => {
    var results = [];
    var page = request.query.q || 1; 
    if (isNaN(page)) {
      return reply.status(404).json({ results }); // Change 'res' to 'reply'
    }
    url = `${baseURL}/popular.html?page=${page}`;
    rs(url, (err, resp, html) => {
      if (!err) {
        try {
          var $ = cheerio.load(html);
          $(".img").each(function (index, element) {
            let title = $(this).children("a").attr().title;
            let id = $(this).children("a").attr().href.slice(10);
            let image = $(this).children("a").children("img").attr().src;
            let href = "/info/"+id
            results[index] = { title, id, image, href };
          });
  
          reply.status(200).json({ results });
        } catch (e) {
          reply.status(504).json({ e: "504 Error" });
        }
      } else {
        reply.status(504).json({ e: "504 Error" }); // Add this block for handling request errors
      }
    });
  });
  
  app.get("/animemovies", (request, reply) => {
    var results = [];
    var page = request.query.q || 1; 
    if (isNaN(page)) {
      return res.status(404).json({ results });
    }
    url = `${baseURL}/anime-movies.html?page=${page}`;
    rs(url, (err, resp, html) => {
      if (!err) {
        try {
          var $ = cheerio.load(html);
          $(".img").each(function (index, element) {
            let title = $(this).children("a").attr().title;
            let id = $(this).children("a").attr().href.slice(10);
            let image = $(this).children("a").children("img").attr().src;
            let href = "/info/"+id
            results[index] = { title, id, image, href };
          });
  
          reply.status(200).json({ results });
        } catch (e) {
          reply.status(404).json({ e: "504 Error" });
        }
      }
    });
  });



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
