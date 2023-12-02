import fetchAnimeInfo from "../Fetcher/fetchAnimeInfo.js";

async function handleFetchingInfoRoutes(request, reply){
    try{
        var animeId = request.params.animeId;
        return reply.status(200).json(await fetchAnimeInfo(animeId));

    }catch(err){
        return {'message':"504 error"};
    }
}

export default handleFetchingInfoRoutes;