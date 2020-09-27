export function authMiddleware(apiKey: string) {
    return function(req, res, next) {
        const authorization = req.headers["authorization"] || "";
        if (authorization !== apiKey) {
            return res.status(401).send({error: "Authentication Failed"});
        }

        return next();
    }
}
