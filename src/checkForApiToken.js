module.exports = (req, res, next) => {
    const apiToken = req.header("x-api-key");
    console.log(apiToken)
    console.log(process.env.API_TOKEN)
    console.log(String(process.env.API_TOKEN) == String(apiToken))
    if (String(process.env.API_TOKEN) != String(apiToken)) {
        next(new Error("Unauthorized."));
        return;
    }
    next();
}