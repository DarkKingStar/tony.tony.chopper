const fastify = require('fastify');
const cheerio = require("cheerio");
const rs = require("request");
const { ANIME } = require('@consumet/extensions');

const baseURL = "https://gogoanimehd.io";
const gogoanime = new ANIME.Gogoanime();

const PORT = process.env.PORT || 3000;

const app = fastify();

app.register(require('@fastify/cors'), {
  origin: '*', // Allow requests from any origin
  credentials: true, // Allow credentials like cookies
  optionSuccessStatus: 200
});


app.register(require('@fastify/sensible'));

// Define routes

// Home route
app.get('/', async (req, res) => {
  if(gogoanime.isWorking){
    const routes = [
      { path: '/anime?q={query}', description: 'Search for anime' },
      { path: '/popular?q={page}', description: 'Get popular anime' },
      { path: '/animemovies?q={page}', description: 'Get anime movies' },
      { path: '/recent-release?q={page}', description: 'Get recent anime releases' },
      { path: '/top-airing?q={page}', description: 'Get top airing anime' },
      { path: '/info?q={animeId}', description: 'Get information about a specific anime' },
      { path: '/watch?q={server}&e={episodeId}', description: 'Watch an episode of an anime' },
      { path: '/server?q={episodeId}', description: 'Get servers for an episode' },
      { path: '/genrelist', description: 'Get a list of anime genres' },
      { path: '/genre/:type', description: 'Get anime by genre' }
    ];
    res.send({ Message: "Welcome to Tony Tony Chopper Server 🎉", routes });
  } else {
    res.status(502).send({ Message: "Gogoanime Server Offline | Not Responding" });
  }
});

// Recent release route
app.get('/recent-release', async (request, reply) => {
  const page = request.query.q;
  try{
    const res = await gogoanime.fetchRecentEpisodes(page)
    .catch((err) => reply.status(404).send({ message: err }));
    reply.status(200).send(res);
  } catch (err) {
    reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later.' });
  }
});

// Top airing route
app.get('/top-airing', async (request, reply) => {
  const page = request.query.q;
  try{
    const res = await gogoanime.fetchTopAiring(page)
    .catch((err) => reply.status(404).send({ message: err }));
    reply.status(200).send(res);
  } catch (err) {
    reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later.' });
  }
});

// Anime search route
app.get('/anime', async (request, reply) => {
  const query = request.query.q;
  try{
    const res = await gogoanime.search(query)
    .catch((err) => reply.status(404).send({ message: err }));
    reply.status(200).send(res);
  } catch (err) {
    reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later.' });
  }
});

// Anime info route
app.get('/info', async (request, reply) => {
    const animeId = request.query.q;
    try{
      const res = await gogoanime.fetchAnimeInfo(animeId)
      .catch((err) => reply.status(404).send({ message: err }));
      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
});

// Watch route
app.get('/watch', async (request, reply) => {
  const episodeId = request.query.e;
  const server = request.query.q;
  try {
    const res = await gogoanime
      .fetchEpisodeSources(episodeId, server)
      .catch((err) => reply.status(404).send({ message: err }));

    reply.status(200).send(res);
  } catch (err) {
    reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later.' });
  }
});

// Server route
app.get('/server', async (request, reply) => {
  const episodeId = request.query.q;
  try {
    const res = await gogoanime
      .fetchEpisodeServers(episodeId)
      .catch((err) => reply.status(404).send({ message: err }));

    reply.status(200).send(res);
  } catch (err) {
    reply
      .status(500)
      .send({ message: 'Something went wrong. Please try again later.' });
  }
});

app.get("/genrelist", (request, reply) => {
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
  
          reply.status(200).send({ list });
        } catch (e) {
          reply.status(404).send({ e: "404 Error" });
        }
      }
    });
  });
  app.get("/genre/:type", (request, reply) => {
    var results = [];
    var type = request.params.type;
    var page = request.query.q || 1; 
    if (isNaN(page)) {
      return res.status(404).send({ results });
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
  
          reply.status(200).send({ results });
        } catch (e) {
          reply.status(404).send({ e: "404 Error" });
        }
      }
    });
  });
  app.get("/popular", (request, reply) => {
    var results = [];
    var page = request.query.q || 1; 
    if (isNaN(page)) {
      return reply.status(404).send({ results }); // Change 'res' to 'reply'
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
  
          reply.status(200).send({ results });
        } catch (e) {
          reply.status(504).send({ e: "504 Error" });
        }
      } else {
        reply.status(504).send({ e: "504 Error" }); // Add this block for handling request errors
      }
    });
  });
  
  app.get("/animemovies", (request, reply) => {
    var results = [];
    var page = request.query.q || 1; 
    if (isNaN(page)) {
      return res.status(404).send({ results });
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
  
          reply.status(200).send({ results });
        } catch (e) {
          reply.status(404).send({ e: "504 Error" });
        }
      }
    });
  });


  app.listen({
    port: PORT,
    host: '0.0.0.0'
  }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
  });
