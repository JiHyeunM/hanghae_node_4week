const express = require("express")
const router = express.Router();
const {Post} = require("../models")
const authMiddleware = require("../middlewares/auth-middleware")


// 게시글 작성
router.post("/",authMiddleware, async (req,res)=>{
    try{
        const {user} = res.locals
        const {title, content } = req.body;
        const createdAt = new Date(); 
        const updatedAt = new Date();
        await Post.create({
            userId : user.userId,
            nickname : user.nickname,
            title, 
            content, 
            createdAt,
            updatedAt,
            likes : 0,
        });
        res.status(201).json({msg : "게시글을 생성하였습니다"})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 작성 실패"})
    }
})

// 게시글 목록 조회
router.get("/", async(req,res)=>{ 
    try{
        const posts = await Post.findAll({order: [['createdAt', 'DESC']]})
        console.log(posts)
        const post = posts.map((item) => { 
            return {
                postId : item.postId, 
                userId : item.userId,
                nickname : item.nickname,
                title : item.title,
                createdAt : item.createdAt,
                updatedAt : item.createdAt,
                likes : item.likes
            }
        })
        res.status(200).json({data:post})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 목록 조회 실패"})
    }
})

// 게시글 상세조회
router.get("/:postId", async(req,res)=>{
    try{
        const { postId } = req.params 
        const posts = await Post.findOne({where:{postId:postId}})
        res.status(200).json({posts})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 조회 실패"})
    }
})

// 게시글 수정
router.put("/:postId", authMiddleware, async(req,res)=>{
    try{
        const {postId} = req.params;
        const {title, content} = req.body;
        await Post.update({title, content}, {where:{postId:postId}})
        res.status(201).send({msg : "게시글을 수정하였습니다"})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "수정에 실패하였습니다"})
    }
})

// 게시글 삭제
router.delete("/:postId", authMiddleware, async(req,res)=>{
    try{
        const { postId } = req.params
        await Post.destroy({where:{postId:postId}})
        return res.status(201).json({msg : "게시글을 삭제하였습니다"})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 삭제 실패"})
    }
})



module.exports = router