const mongoose=require("mongoose")
const ObjectID = mongoose.Schema.Types.ObjectId
const moment=require('moment')
const serviceSchema=new mongoose.Schema({
    owner : {
        type: ObjectID,
       // required: true,
        ref: 'login'
    },
    category:{
        type:String,
        default:""
       // required:true
    },
    amount:{
        type:Number,
        default:0
       // required:true
    },
    Date:{
        type:Date,
        default:moment(new Date()).format('YYYY-MM-DD h:mm:ss a')
    }
})
//const collection2=new mongoose.model("services",serviceSchema) 


module.exports=new mongoose.model("services",serviceSchema) 

