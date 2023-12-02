import fetchAnimeInfo from "../Fetcher/fetchAnimeInfo.js";

async function handleFetchingInfoRoutes(request, reply){
    try{
        var animeId = request.params.animeId;
        let jsonData= [];
        try{
            jsonData = await fetchAnimeInfo(animeId);
        } catch (error) {
            console.error('Error fetching anime info :', error);
            jsonData = [{"error": error }];
        } 
        reply.status(200).json(jsonData)

    }catch(err){
        return {'message':"504 error"};
    }
}

export default handleFetchingInfoRoutes;