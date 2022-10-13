// 로그인 할 때 토큰 생성 / 주의 유저아이디를 토큰에 담아야 함 / 토큰을 다른 에이피아이에서 확인해야 함
// 확인하는 코드를 다 적으면 중복됨 그래서 하나로 만들어 파일을 만들어 에이피아이들이 작동할 때마다 거쳐 가도록 하는 게 미들웨어 
// 프론트웨어 미들웨어 토큰확인 에이피아이로 넘어옴 / 토큰확인용 어스미들웨어

// JWT검증
const jwt = require("jsonwebtoken")
const User = require("../models/user")

module.exports = (req, res ,next)=>{
    
    // 사용자 인증되는지 토큰 검사
    const {authorization} = req.headers;
    // tokenType이 Bearer일 때만 정상적으로 동작하면 됨
    if(!authorization){
        res.status(401).send({errorMessage: '로그인 후 사용하세요'})
        // tokenType이 Bearer이 아니면 next가 호출이 안 되게 해야 함
        return;
    }
    // 와 뒤에 있는 데이터를 가져옴
    console.log(authorization)
    const [tokenType, tokenValue] = authorization.split(' '); // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzQ0NWMxZGI0OWE5YWU0Mjk5ZmE1YjQiLCJpYXQiOjE2NjU0OTI1NzZ9.4DpN2U3SR1iw4aHfOttl_uWC9SdJ17A04Is3ZOkbTuw
    if(tokenType !== 'Bearer'){
        res.status(401).send({errorMessage: '로그인 후 사용하세요'})
        return;
    }
    if(tokenType == undefined){
        res.status(401).send({errorMessage: '로그인 후 사용하세요'})
        return;
    }


    // JWT검증
    try{
        const {userId} = jwt.verify(tokenValue, "my-secret-keykey"); // userId 값 가져오기 
        // 사용자가 DB에 있는지 확인
        User.findById(userId).exec().then((user)=>{ // { _id: 6252234, nickname: "우와앙", password: '1111' }
            // 사용자를 DB에서 가져올 수 있음
            // 미들웨어를 사용해서 res.locals.uesr = user;에 접근하면 항상 사용자 정보가 들어있는 상태로 API 구현 가능
            console.log('여기는 middleware의 부분입니다', user);
            res.locals.user = user;
            // res.locals.hello = 'hi';
            // const user = { _id: 6252234, nickname: "우와앙", password: '1111' };
            next();
        }); 
        // decoded가 제대로 값이 나오는 경우는 항상 유효한 토큰인 것
    }catch(error){
        // 유효한 토큰이 아닌 경우에는 여기로 옴
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요'
        })
        // tokenType이 Bearer이 아니면 next가 호출이 안 되게 해야 함
        return;
    }

    // 미들웨어는 next가 반드시 포함되어야 함
    // 만약 next가 호출되지 않는다 -> 
    // 미들웨어 레벨에서 예외 처리에 걸려서 뒤에 있는 미들웨어에는 연결이 안 되는 형식이라 주의
};