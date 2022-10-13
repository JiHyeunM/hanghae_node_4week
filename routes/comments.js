const express = require("express");
const router = express.Router();
const Comm = require("../models/comment")
const authMiddleware = require("../middlewares/auth-middleware")


// 댓글 작성
router.post("/:postId", authMiddleware, async(req,res)=>{
    try{
        const {postId} = req.params;
        const {comment} = req.body;
        const {nickname, userId} = res.locals.user;
        // console.log(user.nickname, user.userId)
        const createdAt = new Date();
        const updatedAt = new Date();
        if(!comment){res.status(400).send({msg:"댓글 내용을 입력해 주세요"})}
        else{await Comm.create({postId, userId, nickname, comment, createdAt, updatedAt});
                res.status(201).send({msg:"댓글을 생성하였습니다"})}
    }catch(error){
        console.log(error)
        res.status(400).send({msg:"댓글 작성에 실패하였습니다"})
    }
})

// 댓글 목록 조회
router.get("/:postId", async(req,res)=>{
    try{
        const {postId} = req.params;
        const comment = await Comm.find({postId}).sort("-createdAt");
        // console.log(comment.nickname)
        const comments = comment.map((com)=>{
            return{
                commentId:com._id,
                userId:com.userId,
                nickname:com.nickname,
                comment:com.comment,
                createdAt:com.createdAt,
                updatedAt:com.updateAt
            }
        })
        res.status(201).json({data:comments})
        // console.log(comment)
    }catch(error){
        console.log(error)
        res.status(400).send({msg:"댓글 목록 조회에 실패하였습니다"})
    }
})

// 댓글 수정
router.put("/:commentId", authMiddleware, async(req,res)=>{
    try{
        const {commentId} = req.params;
        const {comment} = req.body;
        console.log(commentId, comment)
        const comments = await Comm.findOne({_id:commentId})
        if(comments){
            await Comm.updateOne({_id:commentId}, {$set:{comment}})
            return res.status(201).send({msg:"댓글을 수정하였습니다"})
        }
    }catch(error){
        console.log(error)
        res.status(400).send({msg:"댓글 수정에 실패하였습니다"})
    }
})

// 댓글 삭제
router.delete("/:commentId", authMiddleware, async(req,res)=>{
    try{
        const {commentId} = req.params;
        const comments = await Comm.findOne({_id:commentId})
        if(comments){
            await Comm.deleteOne({_id:commentId})
            return res.status(201).send({msg:"댓글을 삭제하였습니다"})
        }
    }catch(error){
        console.log(error)
        res.status(400).send({msg:"댓글 삭제에 실패하였습니다"})
    }
})

module.exports = router