const express = require("express");
const app = express();
const connect = require("./models/index");
const Router = require("./routes/index");

connect();

app.use(express.json())

app.use(Router)

app.listen(3000, ()=>{
    console.log('3000 포트로 서버가 열렸어요')
})
