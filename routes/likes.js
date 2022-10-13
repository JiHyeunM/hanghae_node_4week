const express = require("express")
const router = express.Router();
const {Post, like, User} = require("../models")
const authMiddleware = require("../middlewares/auth-middleware")

// 게시글 좋아요
router.put("/posts/:postId/like",authMiddleware,async(req,res)=>{
    try{
        const {userId} = res.locals.user
        const {postId} = req.params;
        const Like = await like.findOne({where:{postId, userId}});
        if(!Like){
            // 포스트에 있는 likes 값을 증가
            await Post.increment({likes : 1},{where:{postId:postId}})
            // 좋아요 한 게시물과 유저를 like에 추가?
            await like.create({postId:postId,userId:userId})
            res.status(201).send({msg:"좋아요 등록"})
        }else{
            // 있으면? 취소를 해야지
            await Post.decrement({likes:1},{where:{postId:postId}})
            await like.destroy({where:{postId:postId,userId:userId}})
            res.status(201).send({msg:"좋아요 취소"})
        }
        // like에서 
        // 
    }catch(error){
        console.log(error)
        res.status(400).send({msg:"좋아요 에러"})
    }
})

// 게시글 좋아요 조회 
router.get("/posts/like",authMiddleware,async (req,res)=>{
    try{
        // likes table에 있는 postId 조회
        // const {postId} = await Post.findOne({where:{postId}})
        const {userId} = res.locals.user
        const Likes = await like.findAll({where:{userId}})
        // console.log(Likes.postId)
        // like에 있는 postId들을 새 배열로
        const postList = Likes.map((Likes)=>Likes.postId)
        const data = []
        for(const postId of postList){
            const poli = await Post.findOne({where:{postId:postId}
            ,attributes: {exclude : ['content']}
            })
            const post_list ={
                postId : poli.postId,
                userId : poli.userId,
                nickname : poli.nickname,
                title : poli.title,
                createdAt  : poli.createdAt,
                updatedAt : poli.updatedAt,
                likes : poli.likes
            }
            data.push(post_list)
        }
        data.sort((a,b)=>b.likes-a.likes)
        res.send({data})
        // map으로 보내
    }catch(error){
        console.log(error)
        res.status(400).send({msg:"좋아요 게시글 조회 실패"})
    }
    
})


module.exports = router;