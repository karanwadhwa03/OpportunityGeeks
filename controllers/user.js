const companymodel=require('./../models/company');
const usermodel=require('./../models/user');
const blogmodel=require('./../models/blog');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const crypto =require('crypto');
const { validationResult}=require('express-validator');
const blog = require('./../models/blog');


exports.getdashboard=(req,res)=>{
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
        console.log(sessionuser)
        res.render('userdashboard',{pagetitle:'userdashboard',session:sessionuser});
    })
    
}

exports.getopportunities=(req,res)=>{
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    companymodel.find().sort({time:-1}).then(companies=>{
        // console.log(companies)
        res.render('useropportunities',{pagetitle:'USEROPPORTUNITIES',companies:companies,session:sessionuser});
    })
})

}

exports.getopportunitiessingle=(req,res)=>{
    const id=req.params.id;
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    companymodel.findById(id).then(company=>{
        res.render('companysingle',{pagetitle:'CompanyInfo',company:company,session:sessionuser})

    })
    })

}

exports.postsignup=(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const confirmpassword=req.body.confirmpassword;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('home',{pagetitle:'Home',errorMessage:errors.array()[0].msg})
    }


    usermodel.findOne({email:email}).then(user=>{
        if(user){
            console.log('EMAIL ALRESDY EXIST');
            req.flash('error','This Account Already Exists');
            res.redirect('/');
        }
        else{
            bcrypt.hash(password,12).then(hashedpassword=>{
                const user=new usermodel({name:name,email:email,password:hashedpassword});
                user.save();
                req.flash('error','Account Created');
                res.redirect('/');
            })
            
        }
    })

    //res.send(req.body);
    


}

exports.postsignin=(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    
    usermodel.findOne({email:email}).then(user=>{
        if(!user){
            req.flash('error','This email does not Exist First Create An Account');
            res.redirect('/');

        }
        else{
            bcrypt.compare(password,user.password).then(Match=>{
                if(!Match){
                     req.flash('error','Password Is Wrong Try Again');
                    return res.redirect('/');

                }
                else{
                    req.session.user=user;
                    console.log(user)
                    if(user.level=='admin'){
                    req.session.loggedIn=true;
                    res.redirect('/admin/dashboard');
                        }
                
                    else
                    {
                    
                    req.session.loggedIn=true;

                    res.redirect('/user/dashboard');
                    }
                    console.log(req.session);
                }

            })
            
        //     if(user.password==password){
        //         usermodel.findOne({email:email}).then(user=>{
        //             req.session.user=user;
        //             console.log(user)


        //         })
        //         .then(()=>{

                


        //         if(user.level=='admin'){
        //             req.session.loggedIn=true;
        //             res.redirect('/admin/dashboard');
        //         }
                
        //         else
        //         {
                    
        //         req.session.loggedIn=true;

        //         res.redirect('/user/dashboard');
        //         }

        //     })

        //     }
        //     else{
        //         res.redirect('/');
        //     }
         }


    });

}

exports.postlogout=(req,res)=>{
    req.session.destroy();
res.redirect('/');
}

exports.postprofile=(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const rollno=req.body.rollno;
    const gender=req.body.gender;
    const branch=req.body.branch;
    const tenpercent=req.body.tenpercent;
    const twelvepercent=req.body.twelvepercent;
    const cgpa=req.body.degreepercent;
    const backlog=req.body.backlog;
    const contact=req.body.contact;
    const id=req.body.id;
    const use={_id:id};
    let image='';
    let resume='';
    usermodel.findById(id).then((user)=>{

        image=user.image;
        resume=user.resume;
        

    }).then(()=>{



    
    // console.log(image);
    // console.log(resume);

    // console.log('-----------------------------------------------');
    // console.log(req.files.image);
    // console.log(req.files.resume)
    // console.log('-----------------------------------------------');

    if(req.files.image){
        console.log('ENTER 1')
        image=req.files.image[0].path;
    }
    if(req.files.resume){
        console.log('ENTER 2')
        resume=req.files.resume[0].path;
    }
    console.log('-----------------------------------------------');

     
    console.log(image);
    console.log(resume);

    console.log('-----------------------------------------------');


   
     usermodel.findOneAndUpdate(use,{updated:true,resume:resume,image:image,name:name,email:email,rollno:rollno,gender:gender,branch:branch,tenthpercentage:tenpercent,twelvepercentage:twelvepercent
     ,cgpa:cgpa,backlog:backlog,contact:contact}).then(()=>{
         
         console.log('UPDATED')
         res.redirect('/user/dashboard');

     })

    })


}

exports.getmyprofile=(req,res)=>{
    const id=req.session.user._id;
    usermodel.findById(id).then(user=>{
        
        res.render('singleprofile',{pagetitle:'MyProfile',session:user});


    })

}


exports.getforgotpassword=(req,res)=>{
    res.render('forgotpassword',{pagetitle:'ForgotPassword'});
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'opportunitygeeks@gmail.com',
      pass: '9253316755'
    }
  });



exports.postforgotpassword=(req,res)=>{
    const email=req.body.email;
    //res.send(email)
    crypto.randomBytes(32,(err,Buffer)=>{
        if(err)
        {
            console.log(err);
            return res.redirect('/user/forgotpassword');
        }
        const token=Buffer.toString('hex');
        usermodel.findOne({email:email}).then(user=>{
            if(!user){
                req.flash('error','No Accoount With That Email Found');
               return res.redirect('/user/forgotpassword');
            }
            user.resettoken=token;
            user.resettokenexpiry=Date.now()+3600000;
            user.save();
            console.log(user)
        }).then(result=>{
            var mailOptions = {
                from: 'opportunitygeeks@gmail.com',
                to: email,
                subject:'ForgotPassWord',
                html: `<a href="https://localhost:4000/user/reset/${token}">Click To Reset</a>`
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              }); 
            req.flash('error','Check Email');
            res.redirect('/');
        })
    })
}


exports.getnewpassword=(req,res)=>{
    const token=req.params.token;
    usermodel.findOne({resettoken:token,resettokenexpiry:{$gt :Date.now()}}).then(user=>{
        if(!user){
            req.flash('error','Token Expired Again Generate THe Link');
            res.redirect('/');
        }
        else{
            res.render('newpassword',{pagetitle:'NewPassword',userid:user._id});
        }

    })

}

exports.postnewpassword=(req,res)=>{
    const password =req.body.password;
    const confirmpassword=req.body.confirmpassword;
    const id=req.body.id;
    //usermodel.findOne({_id:id}).then(user=>res.send(user))


    usermodel.findOne({_id:id}).then(user=>{
        console.log(user)
        bcrypt.hash(password,12).then(hashedpassword=>{
            user.password=hashedpassword;
            user.resettoken=undefined;
            user.resettokenexpiry=undefined;
            return user.save();})


        .then(result=>{
            req.flash('error','Password Updated');
            res.redirect('/');
        })


    })

}

exports.getapi=(req,res)=>{
    usermodel.find().then(users=>
        res.send(users)
        );
}

exports.getchangepassword=(req,res)=>{
    //res.send()
    let error=req.flash('error')
  if(error.length>0){
    error=error[0];
  }
  else
  error=null;
    
    usermodel.findById(req.session.user._id).then(user=>{
        //res.send(user);
    
    res.render('changepassword',{pagetitle:'ChangePassword',session:user,errorMessage:error});
})
}

exports.postchangepassword=(req,res)=>{
   // res.send(req.body);
    const old=req.body.old;
    const newpassword=req.body.new;
    const confirm =req.body.confirm;
    //res.send(old)
    console.log(old)
    usermodel.findById(req.session.user._id).then(user=>{
       // res.send(user)

      // console.log(user)
      // bcrypt.hash(old,12).then(hashedpassword=>console.log(hashedpassword))
        bcrypt.compare(old,user.password).then(doMatch=>{
            console.log(doMatch)
            if(!doMatch){
                console.log("NOTDONE")
                req.flash('error','Old Password Is Incoorect')
                res.redirect('/user/changepassword');


            }
            else{
                bcrypt.hash(newpassword,12).then(newpassword=>{
                   usermodel.findOneAndUpdate({_id:req.session.user._id},{password:newpassword}).then(()=>{
                    console.log("DONE")
                    req.flash('error','Password UPDATEd')
                    res.redirect('/user/changepassword');
                    
                   })
                   // user.save();

                })
            }

        })

    })



}



exports.getblogpage=(req,res)=>{
    usermodel.findOne({_id:req.session.user._id}).then(user=>{
        blogmodel.find().populate('createdBy').then(blogs=>{
           
            

        
   // res.send(blogs)
    res.render('blog',{pagetitle:'BLOG',session:user,blogs:blogs})
    


})
})
}

exports.postpost=(req,res)=>{
    //res.send(req.body);
    const title=req.body.title;
    const tag=req.body.tag;
    const body=req.body.editor1;
    console.log(body);

    const blog =new blogmodel({title:title,tag:tag,body:body,createdBy:req.session.user._id});
    blog.save();

    res.redirect('/user/blog')


}

exports.getsingleblogpage=(req,res)=>{
    const id=req.params.id;
    blogmodel.findById(id).populate('createdBy').populate('comments.userid').then(blog=>{
            //res.send(blog);
       // blog.Addcomments({_id:'5fc1360861365b49b02b9cc9',text:'kssks'});
        usermodel.findOne({_id:req.session.user._id}).then(user=>{
//res.send(user)
        // console.log(user);
        // console.log(blog)
        res.render('singleblog',{pagetitle:'SinglePost',session:user,blog:blog})
    })
    })

}

exports.postcomment=(req,res)=>{
    //res.send(req.body)
    const comment=req.body.comment;
    const blogid=req.body.blogid;
    const userid=req.body.userid;

    blogmodel.findById(blogid).then(blog=>{
       var commentt={userid:userid,text:comment};
        blog.Addcomments(commentt);

        //res.send(blog)
    })
    
    res.redirect('/user/blog/'+ blogid);


}

exports.commentdelete=(req,res)=>{
    const blogid=req.body.blogid; 
    const commentid=req.body.commentid;
    blogmodel.findById(blogid).then(blog=>{
        blog.deletecomment(commentid)
    })
    res.redirect('/user/blog/'+blogid);

}

exports.blogdelete=(req,res)=>{
    const id=req.body.blogid;
    // /res.send(req.body)
    blogmodel.findOneAndDelete({_id:id}).then(()=>{
        console.log('DLETED');
    }).then(()=>{
        res.redirect('/user/blog')
    })
    
}