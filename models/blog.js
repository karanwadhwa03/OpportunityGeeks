const mongoose=require('mongoose');

const blogSchema=mongoose.Schema({
    title:String,
    tag:String,
    body:String,
    time : { type : Date, default: Date.now },
    comments:[  {userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
        }
        ,
        text:String}],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

})

blogSchema.methods.Addcomments=function(comment){
    console.log(comment)
    var  oldcomments=[...this.comments];
    console.log(oldcomments);
    oldcomments.push(comment);
    //console.log(oldcomments)
    this.comments=oldcomments;
    console.log(this.comments)
    return this.save();
    
}

blogSchema.methods.deletecomment=function(id){
    const comments=this.comments.filter(comment=>{return comment._id!=id});
    this.comments=comments;
    this.save();
    
}





module.exports=mongoose.model('blog',blogSchema);