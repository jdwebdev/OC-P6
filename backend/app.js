const express = require("express");

//Pour créer une application express
const app = express();

app.use((req, res, next) => {
    console.log("Requête reçue !");
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    // On utilise l'objet res et la méthode json() pour renvoyer une réponse en json
    res.json({message: "Votre requête a bien été reçue"});
    next();
});

app.use((res,req) => {
    console.log("La réponse a été envoyée avec succès");
})

module.exports = app;