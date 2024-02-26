const fastify = require("fastify")({ logger: false });
const welcomeData = require("./welcome.js");
const { getRoutes } = require("./route/getRoutes.js");
const { postRoutesNoAuth, postRoutesAuth } = require("./route/postRoutes.js");
const { connectToMongoDB } = require("./config/mongodb.js");
const PORT = process.env.PORT || 3000;

fastify.register(require("@fastify/cors"), {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
});

fastify.register(async (instance, options) => {
  const db = await connectToMongoDB();

  instance.get("/", async (request, reply) => {
    try {
      reply.code(200).send(welcomeData);
    } catch (err) {
      reply.code(500).send({
        status: 500,
        error: "Internal Error",
        message: err,
      });
    }
  });

  getRoutes.forEach((item) => {
    instance.get(item.route, async (request, reply) =>
      item.fetchFunction(item.fetcher, request, reply)
    );
  });

  postRoutesNoAuth.forEach((item) => {
    instance.post(item.route, async (request, reply) =>
      item.postFuntion(request, reply, db)
    );
  });

  postRoutesAuth.forEach((item) => {
    instance.post(
      item.route,
      { preHandler: item.authFunction },
      async (request, reply) => item.postFuntion(request, reply, db)
    );
  });
});

fastify.listen(PORT, "0.0.0.0", (err, address) => {
  if (err) throw err;
  console.log(`server: ${address} listening on http://localhost:${PORT}`);
});
