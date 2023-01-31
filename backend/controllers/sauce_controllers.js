const sauceModels = require("../models/sauce_models");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
    sauceModels.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    sauceModels.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new sauceModels({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes:0,
        usersLiked: [' '],
        usersDisliked: [' ']
    });
    sauce.save()
    .then(() => res.status(201).json({message: "Sauce ajoutée"}))
    .catch(error => res.status(400).json({error}));
    console.log('Sauce initialisée');
};

exports.deleteSauce = (req, res, next) => {
    sauceModels.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                sauceModels.deleteOne({ _id: req.params.id })
                    .then(res.status(200).json({ message: "Sauce supprimée" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
}; 

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        } : { ...req.body };
    sauceModels.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(res.status(200).json({ message: "Sauce modifiée" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {

    let like = req.body.like;

    if (like == 1) {
        sauceModels.updateOne(
            {_id: req.params.id}, 
            {$push: {usersLiked: req.body.userId},
            $inc: {likes: +1}}
        )
        .then(() => res.status(200).json({message: 'like'}))
        .catch(error => res.status(400).json({error})); 
    }

    if (like == 0) {
        sauceModels.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)){
                sauceModels.updateOne(
                    {_id: req.params.id},
                    {$pull: {usersLiked: req.body.userId},
                    $inc: {likes: -1}}
                )
                .then(() => res.status(200).json({message: 'neutre'}))
                .catch(error => res.status(400).json({error}));
            }
            if (sauce.usersDisliked.includes(req.body.userId)){
                sauceModels.updateOne(
                    {_id: req.params.id}, 
                    {$pull: {usersDisliked: req.body.userId},
                    $inc: {dislikes: -1}}
                )
                .then(() => res.status(200).json({message: 'neutre'}))
                .catch(error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(400).json({error}));          
    }

    if (like == -1) {
        sauceModels.updateOne(
            {_id: req.params.id}, 
            {$push: {usersDisliked: req.body.userId},
            $inc: {dislikes: +1}}
        )
        .then(() => res.status(200).json({message: "dislike"}))
        .catch(error => res.status(400).json({error}));  
        console.log('Sauce disliké !'); 
    }
};