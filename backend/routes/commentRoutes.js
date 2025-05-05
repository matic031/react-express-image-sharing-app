var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to perform this action");
        err.status = 401;
        return next(err);
    }
}

// Get all comments or filter by photoId
router.get('/', commentController.list);

// Get comments for a specific photo
router.get('/photo/:photoId', commentController.list);

// Get a specific comment
router.get('/:id', commentController.show);

// Create a new comment (requires login)
router.post('/', requiresLogin, commentController.create);

// Update a comment (only by the comment's owner)
router.put('/:id', requiresLogin, commentController.update);

// Delete a comment (only by the comment's owner)
router.delete('/:id', requiresLogin, commentController.remove);

module.exports = router;