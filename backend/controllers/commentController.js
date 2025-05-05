var CommentModel = require('../models/commentModel.js');

/**
 * commentController.js
 *
 * @description :: Server-side logic for managing comments.
 */
module.exports = {

    /**
     * commentController.list()
     */
    list: function (req, res) {
        var photoId = req.params.photoId || req.query.photoId;

        // Filter comments by photo if photoId is provided
        let filter = {};
        if (photoId) {
            filter.photo = photoId;
        }

        CommentModel.find(filter)
            .populate('postedBy')
            .sort({ createdAt: -1 })
            .exec(function (err, comments) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting comments.',
                        error: err
                    });
                }
                return res.json(comments);
            });
    },

    /**
     * commentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({ _id: id })
            .populate('postedBy')
            .exec(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting comment.',
                        error: err
                    });
                }

                if (!comment) {
                    return res.status(404).json({
                        message: 'No such comment'
                    });
                }

                return res.json(comment);
            });
    },

    /**
     * commentController.create()
     */
    create: function (req, res) {
        var comment = new CommentModel({
            content: req.body.content,
            photo: req.body.photoId,
            postedBy: req.session.userId,
            createdAt: Date.now()
        });

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                });
            }

            // Populate the postedBy field before sending the response
            CommentModel.findById(comment._id)
                .populate('postedBy')
                .exec(function (err, populatedComment) {
                    if (err) {
                        return res.status(201).json(comment);
                    }
                    return res.status(201).json(populatedComment);
                });
        });
    },

    /**
     * commentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({ _id: id }, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            // Check if the logged-in user is the owner of the comment
            if (comment.postedBy.toString() !== req.session.userId) {
                return res.status(403).json({
                    message: 'Not authorized to update this comment'
                });
            }

            comment.content = req.body.content ? req.body.content : comment.content;

            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    });
                }

                return res.json(comment);
            });
        });
    },

    /**
     * commentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({ _id: id }, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            // Check if the logged-in user is the owner of the comment
            if (comment.postedBy.toString() !== req.session.userId) {
                return res.status(403).json({
                    message: 'Not authorized to delete this comment'
                });
            }

            CommentModel.findByIdAndRemove(id, function (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the comment.',
                        error: err
                    });
                }

                return res.status(204).json();
            });
        });
    }
};