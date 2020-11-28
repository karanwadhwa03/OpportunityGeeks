const { query } = require('express');
const companymodel=require('./../models/company');
const usermodel=require('./../models/user')
const nodemailer=require('nodemailer');


exports.getdashboard=(req,res)=>{
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    console.log(sessionuser)

    res.render('admindashboard',{pagetitle:"AdminDashBoard",session:sessionuser});
    })

}

exports.getcreateplacement= (req,res)=>{
    let error=req.flash('error')
  if(error.length>0){
    error=error[0];
  }
  else
  error=null


    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    
    
    res.render('createplacement',{pagetitle:'CreatePlacement',session:sessionuser,errorMessage:error});

    })
}

exports.postcreateplacement=(req,res)=>{
    const companyname=req.body.companyname;
    const position=req.body.position;
    const package=req.body.packageoffered;
    const backlogs=req.body.backlogs;
    const tenthpercentage=req.body.tenthpercentage;
    const twelevepercentage=req.body.twelvepercentage;
    const branches=req.body.branches;
    const link=req.body.link;
    const cgpa=req.body.cgpa;
    // console.log(link)
    const lastdate=req.body.date;
    const type=req.body.type;
    //console.log(type)
    var additional="";
    if(req.files){
        additional=req.files.pdf[0].path;
    }
    
    
    
    //console.log(branches)
    console.log(additional);
    // res.send(req.file.path);
    const company=new companymodel({cgpa:cgpa,type:type,date:lastdate,link:link,name:companyname,position:position,package:package,backlogs:backlogs,tenthpercentage:tenthpercentage,twelvepercentage:twelevepercentage,branches:branches,additional:additional});
    company.save();
    //res.send(req.files)
    req.flash('error','Created');
    res.redirect('/admin/createplacement');
}

exports.deletecompany=(req,res)=>{
    const id=req.body.tid;
    companymodel.findOneAndRemove(id).then(()=>{
        res.redirect('/user/opportunities');

    });
}

exports.editcompany=(req,res)=>{
    const id=req.params.id;
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    companymodel.findById(id).then(company=>{
        res.render('editcompany',{pagetitle:'EditCompany',company:company,session:sessionuser})
    })

    })

}

exports.posteditplacement=(req,res)=>{
    const companyname=req.body.companyname;
    const position=req.body.position;
    const package=req.body.packageoffered;
    const backlogs=req.body.backlogs;
    const tenthpercentage=req.body.tenthpercentage;
    const twelevepercentage=req.body.twelvepercentage;
    const branches=req.body.branches;
    const link=req.body.link;
    // console.log(link)
    const lastdate=req.body.date;
    const type=req.body.type;
    //console.log(type)
    const id=req.body.id;
    console.log(id)
    var additional="";
    companymodel.findById(id).then(company=>{
        console.log(company)
        additional=company.additional;
    })
    
    if(req.file){
        additional=req.file.path;
        console.log("FILE");
    }
    const use={_id:req.body.id};
    companymodel.findOneAndUpdate(use,{type:type,date:lastdate,link:link,name:companyname,position:position,package:package,backlogs:backlogs,tenthpercentage:tenthpercentage,twelvepercentage:twelevepercentage,branches:branches,additional:additional})
    .then((query)=>{
        console.log('updated');
        res.redirect('/user/opportunities'); 
    })


}

exports.getallusers=(req,res)=>{
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    usermodel.find()
            .then(users=>
            res.render('allusers',{pagetitle:'AllUsers',users:users,session:sessionuser})
            );
    
    // res.render('allusers',{pagetitle:'AllUsers'});
            })
}

exports.filterusers=(req,res)=>{

    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{   
    usermodel.find().then(users=>{
        res.render('filterusers',{session:sessionuser,pagetitle:'FilterUser',users:users,filter:false});
    })
        

    })
}

exports.postfilterusers=(req,res)=>{
    let cgpa=req.body.cgpa;
    let backlog=req.body.backlog;
    let tenthpercentage=req.body.tenthpercetage;
    let twelevepercentage=req.body.twelvepercentage;
    let branches=req.body.branches;
    //console.log("SOMETHING")
    // if(cgpa==""){
    //     cgpa=0;
    // }
    // if(backlog==""){
    //     backlog=0;
    // }
    // if(tenthpercentage==""){
    //     tenthpercentage=0;
    // }
    // if(twelevepercentage==""){
    //     twelevepercentage=0;
    // }

    res.redirect(`/admin/filter/?filter=true&cgpa=${cgpa}&backlog=${backlog}&tenth=${tenthpercentage}&twelve=${twelevepercentage}&branches=${branches}`);

    
    // let branchit="";
    // let branchce="";
    // let branchece="";
    // let branchmech="";
    // let branchel="";
    
    // branches.forEach((branch)=>{
    //     console.log(branch);
        // if(branch=='IT'){
        //     branchit="IT";
        // }
        // if(branch=='CE'){
        //     branchit="CE";
        // }
        // if(branch=='ECE'){
        //     branchit="ECE";
        // }
        // if(branch=='EL'){
        //     branchit="EL";
        // }
        // if(branch=='Mech'){
        //     branchit="MEch";
        // }



    // })

    // usermodel.find({
    //     $and :
    //         [
    //             { cgpa:{$gte:cgpa}},
    //             { backlog:{$lte:backlog}},
    //             { tenthpercentage:{$gte:tenthpercentage}},
    //             { twelevepercentage:{$gte:twelevepercentage}},
    //             {$or:[
    //                 {branch:branchit},
    //                 {branch:branchce},
    //                 {branch:branchece},
    //                 {branch:branchel},
    //                 {branch:branchmech}

    //             ]}

    //         ]
        
    // }).then(users=>res.send(users));



       

}

exports.getsingleprofile=(req,res)=>{
    const id=req.params.id;
    usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{
    usermodel.findOne({_id:id}).then(user=>{
        res.render('singleprofile2',{pagetitle:'SingleProfile',session:sessionuser,user:user})

    })
})
    
}

exports.getfilter=(req,res)=>{
    if(!req.query.filter){
        return res.redirect('/');
    }
    
    let cgpa=req.query.cgpa;
    let backlog=req.query.backlog;
    let tenthpercentage=req.query.tenth;
    let twelvepercentage=req.query.twelve;
    let branches=req.query.branches;
    branches=branches.split(',');
    // console.log(backlog)
    // console.log(branches)
    // res.send(req.query)
    //res.send(branches)
    let branchit="";
    let branchce="";
    let branchece="";
    let branchmech="";
    let branchel="";
    
    branches.forEach((branch)=>{
        console.log(branch);
        if(branch=='IT'){
            branchit="IT";

        }
        if(branch=='CS'){
            branchce="CS";
        }
        if(branch=='ECE'){
            branchece="ECE";
        }
        if(branch=='EL'){
            branchel="EL";
        }
        if(branch=='Mech'){
            branchmech="Mech";
        }



    })
    //console.log("plll",branchce);

    if(cgpa==""){
        cgpa=0;
    }
    if(backlog==""){
        backlog=0;
    }
    if(tenthpercentage==""){
        tenthpercentage=0;
    }
    if(twelvepercentage==""){
        twelvepercentage=0;
    }

    usermodel.find({ 
        $and :
            [
                { cgpa:{$gte:cgpa}},
                { backlog:{$lte:backlog}},
                { tenthpercentage:{$gte:tenthpercentage}},
                { twelvepercentage:{$gte:twelvepercentage}},
                {$or:[
                    {branch:branchit},
                    {branch:branchce},
                    {branch:branchece},

                    {branch:branchel},
                    {branch:branchmech}

                ]}

            ]
        
    }).then(users=>{

        usermodel.findOne({_id:req.session.user._id}).then(sessionuser=>{   

            res.render('filterusers',{session:sessionuser,pagetitle:'FilterUser',users:users,filter:true});
            
        })  
        
            
        
    });



    

}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'opportunitygeeks@gmail.com',
      pass: '9253316755'
    }
  });


exports.sendmail=(req,res)=>{
    const maillist=req.body.maillist;
    const mailsubject=req.body.mailsubject;
    const mailtext=req.body.mailtext;
    let path="";
    let pdftype="";
    if(req.files.attachment){
         path=req.files.attachment[0].path;
        //console.log(req.files)
        console.log(path);
        path=path.replace('\\','/');
        pdftype=req.files.attachment[0].mimetype;
        console.log(path)
    }
    //console.log(file.mimetype)

    //res.send(req.files)
    var mailOptions = {
        from: 'opportunitygeeks@gmail.com',
        to: maillist,
        subject: mailsubject,
        text: mailtext
        
            
            , attachments:[
                {filename:

                    `Attachment.${pdftype}` ,path:`./${path}` }
            ]
        
        
        
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
    
     res.redirect('/admin/filterusers');

}


exports.getmakeadmin=(req,res)=>{
    usermodel.findById(req.session.user._id).then(user=>{
        res.render('makeadmin',{pagetitle:'Makeadmin',session:user});
    })
    

}
exports.postmakeadmin=(req,res)=>{
    usermodel.findOne({email:req.body.email}).then(user=>{
        user.level='admin';
        user.save();
    })
    res.redirect('/admin/makeadmin');
}