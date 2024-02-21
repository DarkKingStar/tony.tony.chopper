async function fetchWithParams(ParamsFunction, request, reply){
    const id = request.params.episodeId || request.params.animeId || request.params.data || request.params.type || null;
    if(id === null){
        return reply.code(404).send({"error": "Invalid last params"})
    }
    try{
        let jsonData = await ParamsFunction(id);
        reply.code(200).send(jsonData);
    }catch(err){
        console.error("Error while fetching: ",err);
    }
}

async function fetchWithQuery(QueryFunction, request, reply){
    const page = request.query.p || 1;
    if(isNaN(page) || page == 0){
        return reply.code(404).send({"error": "Invalid Page Number"})
    }
    try{
        const jsonData = await QueryFunction(Number(page));
        reply.code(200).send(jsonData);
    }catch(err){
        console.error("Error while fetching: ",err);
    }
}

module.exports={
    fetchWithParams,
    fetchWithQuery
}