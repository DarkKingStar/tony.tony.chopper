const fastify = require("fastify")({ logger: true });
const welcomeData = require("./welcome.js");
const { getRoutes } = require("./route/getRoutes.js");
const { postRoutesNoAuth, postRoutesAuth } = require("./route/postRoutes.js");
const { connectToMongoDB } = require("./config/mongodb.js");
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const brevoEmailer = require("./SMTP/brevoEmailer.js");
fastify.register(require("@fastify/cors"), {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
});

fastify.register(async (instance, options) => {
  const db = await connectToMongoDB();
  // const db = {};

  instance.get("/", async (request, reply) => {
    try {
      const htmlPath = path.join(__dirname, 'index.html');
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      reply.type('text/html').send(htmlContent);
    } catch (err) {
      console.log(err);
      reply.code(500).send({
        status: 500,
        error: "Internal Error",
        message: err,
      });
    }
  });

  instance.get("/sendtestemail", async (request, reply) => {
    const emailtemplate = path.join(__dirname, './SMTP/template/OTP.html');
    const templateContent = fs.readFileSync(emailtemplate, 'utf8');
    const data = await brevoEmailer("Forgot Password",templateContent,"darkinstarpro@gmail.com"); 
    reply.code(200).send(data);
  })
  
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
