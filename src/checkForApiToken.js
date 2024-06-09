module.exports = (req, res, next) => {
    const apiToken = req.header("x-api-key");
    if (String(process.env.API_TOKEN) == String(apiToken)) {
        next();
    }else {
        next(new Error("Unauthorized."));
        return;
    }
}