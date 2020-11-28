const mongoose=require('mongoose');

const companySchema=mongoose.Schema({
    name:String,
    position:String,
    package:String,
    branches:[String],
    cgpa:String,
    backlogs:String,
    tenthpercentage:String,
    twelvepercentage:String,
    additional:String,
    time:{
        type:String,
        default:Date()
    },
    link:String,
    date:String,
    type:String,
    placed:Boolean
    
})

const companymodel=mongoose.model('company',companySchema);

module.exports=companymodel;