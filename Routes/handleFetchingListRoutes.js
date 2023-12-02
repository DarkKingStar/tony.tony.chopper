async function handleFetchingListRoutes(request, reply, fetchFunction){
    try{
        let page = request.query.p || 1; 
        if (isNaN(page) || Number(page) == 0) {
            return reply.status(404).json({'error':'404 page not found!'}); // Change 'res' to 'reply'
        }
        return reply.status(200).json(await fetchFunction(Number(page)));

    }catch(err){
        return {'message':"504 error"};
    }
}

export default handleFetchingListRoutes;