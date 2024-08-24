// implement your posts router here

const express = require('express');
const Posts  = require('./posts-model');

const router = express.Router()

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }

        const comments = await Posts.findPostComments(req.params.id);
        res.status(200).json(comments)

    }catch (err) {
            res.status(500).json({
                message: "The comments information could not be retrieved"
            })
    }
})

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "The posts information could not be retrieved" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }else {
            res.status(200).json(post)
        }

    } catch (err){
        res.status(500).json({message: "The post information could not be retrieved" })
    }
})

router.post('/', (req, res) => {
    const post = req.body;

    if (!post.title || !post.contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post" 
        })
    }else {
        Posts.insert(post)
             .then(createdPost => {
                res.status(201).json(createdPost)
             })
             .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message
                })
             })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const editedPost = await Posts.findById(req.params.id);
        if (!editedPost) {
            return res.status(404).json({
                message: "The post with the specified ID does not exist"
            });
        }
        if (!req.body.title || !req.body.contents) {
            return res.status(400).json({
                message: "Please provide title and contents for the post"
            });
        }
        const updatedPost = await Posts.update(req.params.id, req.body);
        return res.status(200).json({
            message: "Post updated successfully",
            updatedPost
        });
    } catch (err) {
        return res.status(500).json({
            message: "The post information could not be modified"
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Find the post by ID
        const thePost = await Posts.findById(req.params.id);
        if (!thePost) {
            return res.status(404).json({
                message: "The post with the specified ID does not exist"
            });
        }
        // Delete the post
        await Posts.remove(req.params.id);
        // Return the deleted post information
        res.status(200).json(thePost);
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed"
        });
    }
});




module.exports = router;