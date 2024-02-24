const fastify = require('fastify')({logger: true });
const welcomeData = require('./welcome.js');
const { getRoutes } = require('./route/getRoutes.js');
const PORT = process.env.PORT || 3000;

fastify.register(require('@fastify/cors'), { 
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
})

fastify.get('/', async (request, reply) => {
    try {
        reply.code(200).send(welcomeData);
    } catch (err) {
        reply.code(500).send({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
});

getRoutes.forEach((item)=>{
    fastify.get(item.route, async(request, reply)=> item.fetchFunction(item.fetcher,request,reply))
})

fastify.listen(PORT,'0.0.0.0', (err, address) => {
    if (err) throw err
    console.log(`server: ${address} listening on http://localhost:${PORT}`)
});
