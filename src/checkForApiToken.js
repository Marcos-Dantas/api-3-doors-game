module.exports = (req, res, next) => {
    const apiTokenHeader = req.header("x-api-key");
    const apiToken = process.env.API_TOKEN
    console.log(apiToken)
    console.log(apiTokenHeader)
    console.log(String(process.env.API_TOKEN) == String(apiToken))
    console.log(apiTokenHeader == apiToken)
    if (apiTokenHeader == apiToken) {
        next();
    }else {
        next(new Error("Unauthorized."));
        return;
    }
}