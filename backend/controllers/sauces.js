const Sauce = require("../models/Sauce");
const fs = require("fs"); //package filesystem de node. Pour avoir accès aux différentes opérations liées aux fichiers

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces);
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete req.body._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: "Objet enregistré !"}))
        .catch(error => res.status(400).json({error})); // <== raccourci de { error: error }
};

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
        Sauce.findOne({ _id: req.params.id })
            .then( sauce => {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlinkSync(`images/${filename}`);
            }).catch(error => res.status(500).json({ error })), 
            
            sauceObject = {  
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            }
    ) : sauceObject = { ...req.body };
        
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => { 
            console.log("updateOne");
            res.status(200).json({ message: "Objet modifié !"})
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then( sauce => {
            const filename = sauce.imageUrl.split("/images/")[1]; //On récupère le deuxième élément [1] du tableau pour avoir le nom du fichier
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé !"}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};



