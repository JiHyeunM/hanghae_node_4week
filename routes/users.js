const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router();
const User = require("../models/user")
// const userValidate = require("../middlewares/joi")
const authMiddleware = require("../middlewares/auth-middleware")
const Joi = require("joi")


const check = Joi.object({
    nickname: Joi.string().pattern((new RegExp('^[a-zA-Z0-9]{3,20}$'))).required(),
    password: Joi.string().min(4),
    confirm: Joi.string().min(4)
    });


// 회원가입
router.post("/signup", async (req, res)=>{
    try{
        const { nickname , password , confirm} = await check.validateAsync(req.body);
        console.log(nickname, password)
        if(password !== confirm){
            res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다'
            })
            return; 
        }
        if(nickname == password){
            res.send({
                msg : "아이디와 패스워드가 같습니다"
            })
        }
        // 닉네임이 DB에 있는지 ( 존재하는 유저가 있는지 )
        const users = await User.findOne({nickname});
        if(users){
            res.status(400).send({
                errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다'
            })
            return;
        }
        // 회원가입 완료되면?
        const user = new User({nickname, password});
        await user.save(); // 사용자 저장
        // 응답값
        res.status(201).send({msg: "회원가입 완료"}) // send만 적을 시 성공 success라는 200의 값 반환
    }
    catch(error){
        res.status(400).send({
            errorMessage: "에러 발생"
        })
    } 
});


// 로그인
router.post("/login", async (req,res)=>{
    try{
        // body로 이메일 패스워드를 넘겨줌
        const {nickname, password}=req.body;

        // 이메일과 패스워드가 일치하는 사용자가 있는지
        const user = await User.findOne({nickname, password}).exec();
        if(!user){
            res.status(400).send({ // status(401) = 인증 실패라는 뜻의 status 코드
                errorMessage: '이메일 또는 패스워드가 잘못 되었습니다'
            })
            return;
        }
        //쿠키
        const token = jwt.sign({userId: user.userId}, "my-secret-keykey"); // .sign()을 해야 토큰을 만들 수 있음
        console.log(token);
        // 토큰을 만들었으니 이제 응답
        res.send({
            token // token이라는 키에다가 JWT 토큰을 반환해야 프론트에서 정상적 동작하도록
        });
    }catch(error){
        res.status(400).send({
            errorMessage: "에러 발생"
        })
    }
})

module.exports = router;

