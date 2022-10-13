const express = require("express")
const router = express.Router();
const Post = require("../models/post")
const authMiddleware = require("../middlewares/auth-middleware")


// 게시글 작성
router.post("/",authMiddleware, async (req,res)=>{
    try{
        const {user} = res.locals
        // const {hello} = res.localss
        // console.log(hello);
        // console.log(user._id)
        const {title, content } = req.body;
        // console.log({title, content});
        const createdAt = new Date(); 
        const updatedAt = new Date(); 
        let likes = 0;
        await Post.create({
            userId : user._id,
            nickname : user.nickname,
            title, 
            content, 
            createdAt,
            updatedAt,
            likes
        }); // 디비를 생성하는 함수.create / 디비에 있는 post라는 컬렉션에 저것들을 만들어라
        // console.log(Post)
        res.status(201).json({
            msg : "게시글을 생성하였습니다"
        })
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 작성 실패"})
    }
})

// 게시글 목록 조회
router.get("/", async(req,res)=>{ // 라우터는 위에서 아래로 읽음? 
    try{
        const posts = await Post.find().sort("-createdAt");
        console.log(posts)
        // 가져온 데이터 posts에서 제목 작성자명 날짜 작성 날짜만 가져와서 새 배열로 만듬(map())
        const post = posts.map((item) => { 
            return {
                postId : item._id,
                userId : item.userId,
                nickname : item.nickname,
                title : item.title,
                createdAt : item.createdAt,
                updatedAt : item.createdAt,
                likes : item.likes
            }
        })
        // console.log(userId, nickname)
        // 만든 배열을 제이슨 형태로 값을 전달
        res.status(200).json({data:post})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 목록 조회 실패"})
    }
})

// 게시글 상세조회
router.get("/:_postId", async(req,res)=>{
    try{
        const { _postId } = req.params 
        // 디비 컬렉션에 post에서 _id를 찾아 변수에 할당
        const posts = await Post.findOne({_id:_postId}) // 디비 필드값 : 내가 넣어주는 값
        const post = {
            postId : posts._id,
            userId : posts.userId,
            nickname : posts.nickname,
            title : posts.title,
            content : posts.content,
            createdAt : posts.createdAt,
            updatedAt : posts.updatedAt,
            likes : posts.likes
        }
        // console.log(posts)
        res.status(200).json({post})
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
        await Post.updateOne({postId:postId}, {$set: {title, content}})
        res.status(201).send({msg : "게시글을 수정하였습니다"})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "수정에 실패하였습니다"})
    }
})

// 게시글 삭제
router.delete("/:_postId", authMiddleware, async(req,res)=>{
    try{
        const { _postId } = req.params
        await Post.deleteOne({_id:_postId})
        return res.status(201).json({msg : "게시글을 삭제하였습니다"})
    }catch(error){
        console.log(error)
        res.status(400).send({msg : "게시글 삭제 실패"})
    }
})



module.exports = router