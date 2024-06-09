module.exports = (req, res, next) => {
    const apiToken = req.header("x-api-key");
    console.log(process.env.API_TOKEN)
    console.log(req.header("x-api-key"))
    if (process.env.API_TOKEN !== apiToken) {
        next(new Error("Unauthorized."));
        return;
    }
    next();
}