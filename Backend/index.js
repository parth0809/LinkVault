const express=require("express")
const app=express()
const port=3000


app.get("/",(req,res)=>{
    res.send("jump you!")
});

app.listen(port,()=>{
    console.log(`Port Running in ${port}`)
});