// const Joi = require('joi');

// // 아이디, 패스워드 조건
// module.exports = (req,res,next) => {
// // console.log("req :", req.query);
// const body = req.body;
// const check = Joi.object().keys({
// nickname: Joi.string().pattern((new RegExp('^[a-zA-Z0-9]{3,20}$'))).required(),
// password: Joi.string().min(4)
// });
// try {
//     // await check.validateAsync(body); // 유효성 검사 (위에 조건)
//     next();
    
// } catch (error) {
//     return res.status(400).json({ message: "오류"})
// }
// }