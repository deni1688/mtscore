export function authGuard(apiKey: string) {
    return (req, res, next) => {
        const authorization = req.headers["authorization"] || "";

        if (authorization !== apiKey) {
            return res.status(401).send({error: "Authentication Failed"});
        }

        return next();
    }
}
