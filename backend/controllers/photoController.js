var PhotoModel = require('../models/photoModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
            .populate('postedBy')
            .sort({ createdAt: -1 })  // Sort by creation date, most recent first
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
                var data = [];
                data.photos = photos;
                //return res.render('photo/list', data);
                return res.json(photos);
            });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id })
            .populate('postedBy')
            .exec(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }

                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                // Increment view count
                photo.views += 1;
                photo.save();

                return res.json(photo);
            });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
            name: req.body.name,
            path: "/images/" + req.file.filename,
            message: req.body.message || "",
            postedBy: req.session.userId,
            views: 0,
            likes: 0,
            dislikes: 0,
            createdAt: Date.now()
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            // Check if user is the owner of the photo
            if (photo.postedBy.toString() !== req.session.userId) {
                return res.status(403).json({
                    message: 'Not authorized to update this photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
            photo.message = req.body.message ? req.body.message : photo.message;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            // Check if user is the owner of the photo
            if (photo.postedBy.toString() !== req.session.userId) {
                return res.status(403).json({
                    message: 'Not authorized to delete this photo'
                });
            }

            PhotoModel.findByIdAndRemove(id, function (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the photo.',
                        error: err
                    });
                }

                return res.status(204).json();
            });
        });
    },

    /**
     * photoController.like()
     * Handles likes for photos
     */
    like: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.likes = photo.likes + 1;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating likes.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.dislike()
     * Handles dislikes for photos
     */
    dislike: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.dislikes = photo.dislikes + 1;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating dislikes.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    }
};
