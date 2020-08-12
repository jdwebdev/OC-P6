const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sanitize = require("mongo-sanitize");

exports.signup = (req, res, next) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
exports.login = (req, res, next) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    User.findOne({ email: email})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé"});
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({ 
                        userId: user._id, 
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET", // En production : À remplacer par une chaîne de caractère longue et aléatoire, pour sécuriser pour l'encodage
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};