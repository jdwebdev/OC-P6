const jwt = require("jsonwebtoken");

// Pour chaque requête sur une route protégée on passe d'abord par ce middleware : 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ error: error | "Requête non authentifiée !" });
    }
};