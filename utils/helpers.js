async function fetchWithParams(ParamsFunction, request, reply){
    const id = request.params.episodeId || request.params.animeId || request.params.data || request.params.type || null;
    const page = request.query.p || null;
    if(id === null){
        return reply.code(404).send({"error": "Invalid last params"})
    }
    try{
        if(page!==null){
            let jsonData = await ParamsFunction(id,page);
            reply.code(200).send(jsonData);
        }else{
            let jsonData = await ParamsFunction(id);
            reply.code(200).send(jsonData);
        }
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
const removeDuplicateInList = (animeArray) => {
    const uniqueMalIds = new Set();
    return animeArray.filter((anime) => {
        if (!uniqueMalIds.has(anime.mal_id)) {
            uniqueMalIds.add(anime.mal_id);
            return true;
        }
        return false;
    });
};
const getLocaleTimeFromJST = (jstTime)=>{
let [hours, minutes] = jstTime.split(":").map(Number);

// Create a Date object for the current date in JST
let dateInJst = new Date();
dateInJst.setHours(hours);
dateInJst.setMinutes(minutes);

// Convert to local time
let options = { hour: '2-digit', minute: '2-digit' };
let localTime = dateInJst.toLocaleTimeString(undefined, options);

// Get the local time zone
let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

return [localTime,timeZone];
}
module.exports={
    fetchWithParams,
    fetchWithQuery,
    removeDuplicateInList,
    getLocaleTimeFromJST
}