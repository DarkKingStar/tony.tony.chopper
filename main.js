const express = require('express');
const cors = require('cors');
const Api = require('./api-parser');
const cheerio = require("cheerio");
const rs = require("request");

const baseURL = "https://gogoanimehd.io";


const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', // Allow requests from any origin
    credentails: true, // Allow credentials like cookies
    optionSuccessStatus: 200,
    port: PORT, // Set the port for CORS
};

const app = express();

app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Function to handle routes and return JSON data
const handleRoute = async (req, res, apiFunction) => {
    try {
        const data = await apiFunction(req.query.q || 1); // Use 'q' as a default query parameter
        res.status(200).json(data); // Send JSON response with data
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
};

// Define routes

// Home route
app.get('/', async (req, res) => {
    handleRoute(req, res, Api.Home); // Call handleRoute with Home API function
});

// Recent release route
app.get('/recent-release', async (req, res) => {
    var results = [];
    var page = req.query.q || 1; 
    if (isNaN(page)) {
      return res.status(404).json({ results });
    }
    url = `${baseURL}?page=${page}`;
    rs(url, (err, resp, html) => {
      if (!err) {
        try {
          var $ = cheerio.load(html);
          $(".img").each(function (index, element) {
            let title = $(this).children("a").attr().title;
            let id = $(this).children("a").attr().href.slice(10);
            let image = $(this).children("a").children("img").attr().src;
            let href = "/info?q="+id
            results[index] = { title, id, image, href };
          });
  
          res.status(200).json({ results });
        } catch (e) {
          res.status(404).json({ e: "504 Error" });
        }
      }
    });
});

// Top airing route
app.get('/top-airing', async (req, res) => {
    handleRoute(req, res, Api.Top_Airing); // Call handleRoute with Top_Airing API function
});

// Anime search route
app.get('/anime', async (req, res) => {
    handleRoute(req, res, Api.Search); // Call handleRoute with Search API function
});

// Anime info route
app.get('/info', async (req, res) => {
    //handleRoute(req, res, Api.Anime_Info); // Call handleRoute with Anime_Info API function
    let results = [];
    var animeid = req.query.q || ""; 
    if (animeid == "") {
      return res.status(404).json({ results });
    }
    siteUrl = `${baseURL}/category/${animeid}`;
    rs(siteUrl, (err, resp, html) => {
      if (!err) {
        try {
          var $ = cheerio.load(html);
          var type = " ";
          var summary = "";
          var relased = "";
          var status = "";
          var genres = "";
          var othername = "";
          var title = $(".anime_info_body_bg").children("h1").text();
          var image = $(".anime_info_body_bg").children("img").attr().src;
  
          $("p.type").each(function (index, element) {
            if ("Type: " == $(this).children("span").text()) {
              type = $(this).text().slice(15, -5);
            } else if ("Plot Summary: " == $(this).children("span").text()) {
              summary = $(this).text().slice(14);
            } else if ("Released: " == $(this).children("span").text()) {
              relased = $(this).text().slice(10);
            } else if ("Status: " == $(this).children("span").text()) {
              status = $(this).text().slice(8).trim();
            } else if ("Genre: " == $(this).children("span").text()) {
              genres = $(this).text().slice(20, -4);
              genres = genres.split(",");
              genres = genres.join(",");
            } else if("Other name: " == $(this).children("span").text()){
                othername = $(this).text().slice(12);
            }
            });
          genres.replace(" ");
          var totalepisode = $("#episode_page")
            .children("li")
            .last()
            .children("a")
            .attr().ep_end;
          results[0] = {
            title,
            image,
            type,
            summary,
            relased,
            genres,
            status,
            totalepisode,
            othername,
          };
          res.status(200).json({ results });
        } catch (e) {
          res.status(404).json({ e: "502 Error" });
        }
      }
    });
});

// Watch route
app.get('/watch', async (req, res) => {
    handleRoute(req, res, Api.Watch); // Call handleRoute with Watch API function
});

// Server route
app.get('/server', async (req, res) => {
    handleRoute(req, res, Api.V_Servers); // Call handleRoute with V_Servers API function
});

app.get("/genrelist", (req, res) => {
    var list = [];
  
    let url = baseURL;
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
  
          res.status(200).json({ list });
        } catch (e) {
          res.status(404).json({ e: "404 Error" });
        }
      }
    });
  });
  app.get("/genre/:type", (req, res) => {
    var results = [];
    var type = req.params.type;
    var page = req.query.q || 1; 
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
            let href = "/info?q="+id
            results[index] = { title, id, image, href };
          });
  
          res.status(200).json({ results });
        } catch (e) {
          res.status(404).json({ e: "404 Error" });
        }
      }
    });
  });
  app.get("/popular", (req, res) => {
    var results = [];
    var page = req.query.q || 1; 
    if (isNaN(page)) {
      return res.status(404).json({ results });
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
            let href = "/info?q="+id
            results[index] = { title, id, image, href };
          });
  
          res.status(200).json({ results });
        } catch (e) {
          res.status(404).json({ e: "504 Error" });
        }
      }
    });
  });
  app.get("/animemovies", (req, res) => {
    var results = [];
    var page = req.query.q || 1; 
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
  
          res.status(200).json({ results });
        } catch (e) {
          res.status(404).json({ e: "504 Error" });
        }
      }
    });
  });



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
