const express =require("express");
const router=express.Router();
const mongoose=require("mongoose")
const collection=require("../models/user")
const collection2=require("../models/service")
const bcrypt = require('bcrypt');
//const app=express();
const moment=require('moment')
const jwt=require('jsonwebtoken')
const jwtsecret=process.env.JWT_SECRET


const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
      },
});

//app.use(express.json())
//app.use(express.urlencoded({extended:false}))

const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      //return res.status(401).json( { message: 'Unauthorized'} );
      return res.render("index2",{msg:"Sign in to avail the services"})
    }
  
    try {
      const decoded = jwt.verify(token, jwtsecret);
      req.userId = decoded.userId;
     // console.log(decoded)
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }

 async function amount(id){
    const data=  await collection2.find({owner:new mongoose.Types.ObjectId(id)})
    let resultArr=[]
    data.forEach(function(doc){
        resultArr.push(doc)
        })
        let m=0
        for(let i=0;i<resultArr.length;i++){
           m+=resultArr[i]['amount']
         //data= moment(m).format("YYYY-MM-DD")
        }
       return m
  }
  function Result(Data){
    let resultArr=[]
    Data.forEach(function(doc){
        resultArr.push(doc)
        })
        return resultArr
  }
  
//Routes
router.get('/',(req,res)=>{
    res.render("index");
});
router.get('/index2',(req,res)=>{
    res.render("index2");
});
router.get('/index3',(req,res)=>{
    res.render("index3");
});
router.get('/index4',(req,res)=>{
    res.render("index4");
});
router.get('/addExpense1',authMiddleware,async(req,res)=>{
   /*const Total=await collection.find({_id:req.userId},{_id:0,Total:1,amount:1 })
   const amt= await amount(req.userId)
   const balance=Total-amt*/
    res.render("addExpense1")
});
router.get('/report',authMiddleware,async(req,res)=>{

     const date1=new Date()
    const d11=moment(date1).subtract(1, "days").format('YYYY-MM-DD')
    const d22=moment(date1).add(1, "days").format('YYYY-MM-DD')
   console.log(d11)
    console.log(d22)
    const v=await collection2.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.userId)
            }
        },
       {
            $match:{ Date:{$gt:new Date(d11),$lt:new Date(d22)}}
        }
    ])
    const name=await collection.findOne({_id:req.userId})
    let resultArr=[]
    resultArr=Result(v)
      const amt1= await amount(req.userId)
      const balance=name.Total-amt1
    const data= await collection2.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.userId)
            }
        },
        {
            $group:{
                _id:"$category",
                amt:{$sum:"$amount"}
            }
        },
        { $sort : { _id: 1 } }
    ])
    const data2= await collection2.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.userId)
            }
        },
        {
            $group:{
               _id:{$dateToString: {format: "%b", date: "$Date"}},
                amt:{$sum:"$amount"}
            }
        },
        { $sort : { _id: 1 } }
    ])
   // console.log(data2)
    const date=new Date()
    const d1=moment(date).format('YYYY-MM-DD')
    const d2=moment(date).subtract(7, "days").format('YYYY-MM-DD')
    const d3=moment(date).subtract(1, "month").format('MMM')
   // const d2=moment(date).add(1, "days").format('YYYY-MM-DD')
   
   //console.log(date)
    const v1=await collection2.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.userId)
            }
        },
        {
            $match:{ Date:{$gt:new Date(d2),$lt:new Date(d1)}}
        },
        {
            $group:{
               _id: null,
                amt:{$sum:"$amount"}
            }
        }
    ])
   //console.log(v)
    let resultArr1=[]
    let resultArr2=[]
    let resultArr3=[]
    resultArr1=Result(data)
    resultArr2=Result(data2)
    resultArr3=Result(v1)
   console.log(resultArr)
   /* let m=[]
    for(let i=0;i<resultArr.length;i++){
        if(resultArr[i]['_id']==='Food & Beverage')
        { 
            resultArr[i]['_id']='FoodandBeverage'
        }
        m[i]=resultArr[i]['_id']
     }
    //console.log(typeof data)
    let n=[]
    for(let i=0;i<resultArr.length;i++){
        n[i]=resultArr[i]['amt']
     }
    
     /*console.log(n)
     console.log(typeof n)
     try{
     var a=JSON.stringify(n)
     console.log(typeof a)
     }catch(error) {
        console.log('Error parsing JSON:', error, data);
    }
     //console.log(a)*/
     const amt= await amount(req.userId)
     console.log(resultArr2)
    res.render("report",{user:name,amt1,balance,week:resultArr3,data:resultArr,cat:resultArr1,mon:resultArr2})
});
/*router.get('/profile',authMiddleware,async(req,res)=>{
    const date=new Date()
    const d1=moment(date).subtract(1, "days").format('YYYY-MM-DD')
    const d2=moment(date).add(1, "days").format('YYYY-MM-DD')
   // console.log(d1)
    //console.log(d2)
    const v=await collection2.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req.userId)
            }
        },
       {
            $match:{ Date:{$gt:new Date(d1),$lt:new Date(d2)}}
        }
    ])
    const name=await collection.findOne({_id:req.userId})
    let resultArr=[]
    resultArr=Result(v)
      const amt= await amount(req.userId)
      const balance=name.Total-amt
    res.render("profile",{user:name,balance,amt,data:resultArr});
});*/
router.get('/home',authMiddleware,async(req,res)=>{
    let resultArr=[]
   // const date=new Date()
   // const d=date.toISOString()
    const v=await collection2.find({owner:req.userId});
   // console.log(v)
   v.forEach(function(doc){
   resultArr.push(doc)
   })
   let m=0
   for(let i=0;i<resultArr.length;i++){
      m+=resultArr[i]['amount']
    //data= moment(m).format("YYYY-MM-DD")
   }
   console.log(m)
    res.render("home",{items:resultArr, amt:m});
})


router.post("/signup",async (req,res)=>{
    try{
    const existingUser= await collection.findOne({email:req.body.email})
    if(existingUser){
        res.send("User already exists.Please choose a different email.")
    }
    else{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // data.password=hashedPassword
      // const user= await collection.insertMany([data])
      const user=new collection({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
      })
      await user.save()
       //const verificationToken = user.generateVerificationToken();
      // console.log(user._id)
       const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET)
       const url = `http://localhost:3000/verify?id=${token}`
       transporter.sendMail({
         to: user.email,
         subject: 'Verify Account',
         html: `Click <a href = "${url}">here</a> to confirm your email.`
       })
       res.send(`Sent a verification email to ${user.email}`);
        res.render("index");
    }
}catch(error)
    {
        console.log(error);
    }
})
router.post("/signin",async(req,res)=>{
    try{
        const check=await collection.findOne({email:req.body.email});
       // console.log(check);
        const pass=req.body.password;
       if(!check){
           return res.send("USER NOT FOUND")
        }
        const result= await bcrypt.compare(pass,check.password);
        console.log(result)
        if(!result){
           // console.log("PASS")
          return  res.send("Wrong password")
        }
       /* if(!check.verified){
            return res.status(403).send({ 
                  message: "Verify your Account." 
            });
       }*/
        const token=jwt.sign({userId:check._id},jwtsecret);
        //console.log(token)
        res.cookie('token',token,{httpOnly: true});
          // return res.render("index")
         // console.log(check)
          return res.render("index3",{user:check})
       // console.log(req.body.name)
       // console.log(req.body.password)

    }catch(error){
        console.log(error)
       return res.send("Wrong details")
    }
})

router.get("/verify",async (req, res) => {
   const token  = req.query.id
    if (!token) {
        return res.status(422).send({ 
             message: "Missing Token" 
        });
    }
    try {
       console.log(token)
       const payload = jwt.verify(token,jwtsecret);
      console.log(payload)
        const user = await collection.findById({ _id: payload._id });
        console.log(user)
        if (!user) {
           return res.status(404).send({ 
              message: "User does not  exists" 
           });
        }
        user.verified = true;
        await user.save();
       /* return res.status(200).send({
              message: "Account Verified"
        });*/
        return res.render("verified")
     } catch (err) {
        console.log(err)
        return res.status(500).send(err);
     }
})




router.post("/add", authMiddleware,async(req,res)=>{
   // let expenses=[]
    try{
       /* const data={
           cat:req.body.category,
            amt:req.body.amt
        }*/
   await collection2.insertMany([{owner:req.userId,category:req.body.category,amount:req.body.amt}])
  const result= await collection.updateOne({owner:req.userId},{$set:{Total:req.body.total}})
   
  /* const newExp = new collection2({
    ...req.body,
    owner: req.userId
})
await newExp.save()
*/
//console.log(newExp)
   res.render("addExpense1");
    }catch(error){
        console.log(error);
    }
    //const result=await collection2.findOne({category:"Entertainment"})
   // res.render("addExpense1",{result});
    //console.log(result)
})

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
   return res.redirect('/');
  });



module.exports=router;
