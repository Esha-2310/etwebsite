const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")


const LogInSchema=new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:""
        //required:true
    },
    password:{
        type:String,
        default:0
       // required:true
    },
    Total:{
        type:Number,
        default:0
    },
    verified: {
        type: Boolean,
       // required: true,
        default: false
    }
      })

    /* LogInSchema.methods.generateVerificationToken = function() {
        const user = this
        const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET)
        //user.tokens = user.tokens.concat({token})
         //await user.save()
        return token
    }*/

const collection=new mongoose.model("login",LogInSchema)

module.exports=collection
//module.exports=services