// implement your server here
const express = require('express');
const Posts = require('./posts/posts-router'); // Import the posts router

const server = express();

server.use(express.json()); // Parse JSON request bodies

// Use the posts router for any requests to /posts
server.use('/posts', Posts);

server.get('/', (req, res) => {
    res.send('API up and running');
});

module.exports = server; 