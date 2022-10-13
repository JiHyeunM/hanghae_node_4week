const express = require("express")
const router = express.Router();
const Post = require("../models/post")
const authMiddleware = require("../middlewares/auth-middleware")
const like = require("../models/like")


router.get("/posts/like",(req,res)=>{
    // postId 불러오고
    // user 정보 불러오고
})


router.put("/posts/:postId/like",(req,res)=>{
    
})




module.exports = router;