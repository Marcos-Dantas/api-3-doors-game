module.exports = (req, res, next) => {
    const apiToken = req.header("x-api-key");
    if (process.env.API_TOKEN !== apiToken) {
        next(new Error("Unauthorized."));
        return;
    }
    next();
}