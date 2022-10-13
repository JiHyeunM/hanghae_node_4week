const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const Router = require("./routes/index");

app.use(cookieParser())
app.use(express.json())

app.use(Router)

app.listen(3000, ()=>{
    console.log('3000 포트로 서버가 열렸어요')
})
