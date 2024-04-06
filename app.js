const express=require("express");
const app=express();
const port=process.env.PORT;
const hbs=require("hbs");
const path=require("path");
const connectDB= require('./server/config/db');
const cookieParser=require("cookie-parser");
const session=require("express-session")
const MongoStore = require('connect-mongo');
//const collection=require("../models/mongodb")

//const templatePath=path.join(__dirname,'../templates')
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

connectDB();
app.use(express.json())
app.set('views', path.join(__dirname,'views'))
app.set("view engine","hbs")
//app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
//app.set('layout','./views/home');

app.use(session({
    secret:,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));

app.use(express.static('public'));

/*app.get("/",(req,res)=>{
    res.send("HELLO")
})*/
app.use('/',require('./server/routes/main'))
//app.use("/api/main",main);

app.listen(port,()=>{
    console.log("port connected");
})
