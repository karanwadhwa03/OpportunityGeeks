const mongoose=require('mongoose');

const userschema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    rollno:String,
    gender:String,
    branch:String,
    tenthpercentage:String,
    twelvepercentage:String,
    cgpa:String,
    backlog:String,
    contact:String,
    level:{
        type:String,
        default:'user'
    },
    image:String,
    resume:String,
    updated:Boolean,
    resettoken:String,
    resettokenexpiry:String

})

const usermodel=mongoose.model('user',userschema);

module.exports=usermodel;