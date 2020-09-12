const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    sauceObject.likes = 0;
    sauceObject.dislikes = 0; 
    sauceObject.usersLiked = [];
    sauceObject.usersDisliked = [];
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce saved successfully!' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(201).json({ message: 'Sauce updated successfully!' }))
                        .catch(error => res.status(400).json({ error }));
                    
                })
            })
    
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Deleted!' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        numberLikes = sauce.likes;
        numberDislikes = sauce.dislikes;
        arrayLikingUsers = sauce.usersLiked;
        arrayDislikingUsers = sauce.usersDisliked;
        if(like === 0) {
            if(arrayLikingUsers.filter(user => user === userId)[0] === userId) {
            numberLikes -= 1;
            arrayLikingUsers = arrayLikingUsers.filter(user => user != userId);
            }
            else if(arrayDislikingUsers.filter(user => user === userId)[0] === userId) {
            numberDislikes -= 1;
            arrayDislikingUsers = arrayDislikingUsers.filter(user => user != userId);
            }
            }   else if (like === 1) {
                numberLikes += 1;
                arrayLikingUsers.push(userId);
            }   else if (like === -1) {
                numberDislikes += 1;
                arrayDislikingUsers.push(userId);
            }
        Sauce.updateOne( {_id: req.params.id}, {likes: numberLikes, usersLiked: arrayLikingUsers, 
            dislikes: numberDislikes, usersDisliked: arrayDislikingUsers})
            .then(() => res.status(200).json({ message: 'Objet modifié'}))
            .catch(error => res.status(400).json({error}));
        })
    .catch(error => res.status(404).json({error}));
}