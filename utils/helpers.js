async function fetchWithParams(ParamsFunction, request, reply){
    const id = request.params.episodeId || request.params.animeId || request.params.data || request.params.type || null;
    if(id === null){
        return reply.status(404).json({"error": "Invalid last params"})
    }
    try{
        let jsonData = await ParamsFunction(id);
        reply.status(200).json(jsonData);
    }catch(err){
        console.error("Error while fetching: ",err);
    }
}

async function fetchWithQuery(QueryFunction, request, reply){
    const page = request.query.p || 1;
    if(isNaN(page) || page == 0){
        return reply.status(200).json({"error": "Invalid Page Number"})
    }
    try{
        const jsonData = await QueryFunction(Number(page));
        reply.status(200).json(jsonData);
    }catch(err){
        console.error("Error while fetching: ",err);
    }
}

module.exports={
    fetchWithParams,
    fetchWithQuery
}