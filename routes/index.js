const express = require("express");
const router = express.Router(); 

const postsRouter = require("./posts")
const commentRouter = require("./comments")
const usersRouter = require("./users")
const likesRouter = require("./likes")

router.use("/users", usersRouter) 
router.use(likesRouter) 
router.use("/posts", postsRouter) 
router.use("/comments", commentRouter) 

module.exports = router
