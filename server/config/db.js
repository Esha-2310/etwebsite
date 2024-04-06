const mongoose=require("mongoose")
/*
const connect=mongoose.connect("")
connect.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect");
})*/

const connectDB = async () => {
  
    try {
      mongoose.set('strictQuery',false);
      const conn = await mongoose.connect(process.env.MONGODB_URL);
      console.log("Database Connected");
    } catch (error) {
      console.log(error);
    }
  
  }

module.exports=connectDB;