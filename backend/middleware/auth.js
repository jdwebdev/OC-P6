const jwt = require("jsonwebtoken");

// Pour chaque requête sur une route protégée on passe d'abord par ce middleware : 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "Ri4GzU3go6izhakEGjNgrpJNmdE4T90UpcR4EEmvF1P4bwD0xCkz58oSfqEGn0odsK7fjmjSngoeM3zfng8dv");
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