const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const path=require('path');
var multer = require('multer');
const mongoose=require('mongoose');
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session);
const flash=require('connect-flash');
const csrf=require('csurf');
const cors=require('cors')



const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/jd',express.static(path.join(__dirname,'jd')));
app.use('/resumes',express.static(path.join(__dirname,'resumes')));
app.use('/attachment',express.static(path.join(__dirname,'resumes')));
app.use(cors());




app.set('view engine','ejs');

mongoose.connect('mongodb://localhost:27017/MAJORPROJECT', {useNewUrlParser: true,useUnifiedTopology: true});

const store=new MongoDBStore({
  uri:"mongodb://localhost:27017/MAJORPROJECT",
  collection:'sessions'
})
app.use(session({
  secret:'my secret',
  resave:false,
  saveUninitialized:false,
  store:store
}))
app.use(flash());

// var diskstorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './jd')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
//     }
// })
// app.use(multer({storage:diskstorage}).single('pdf'));



const csrfprotection=csrf();
//app.use(csrfprotection);
app.use((req,res,next)=>{
res.locals.csrfToken='Will Add Soon';
next();
})




const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { // setting destination of uploading files        
    if (file.fieldname === "resume") { // if uploading resume
      cb(null, './resumes');
    }
    else if(file.fieldname=='pdf'){
      cb(null, './jd');
    }
    else if(file.fieldname=='attachment'){
      cb(null, './attachment');
    }
    else { // else uploading image
      cb(null, './images');
    }
  },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") { // if uploading resume
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) { // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else if(file.fieldname === "image") { // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
  else{
    cb(null, true);
  }
};


app.use(
  multer(
    { 
      storage: fileStorage, 
      limits:
        { 
          //fileSize:'2mb' 
        }
      ,fileFilter: fileFilter 
    }
  ).fields(
    [
      { 
        name: 'resume', 
        //maxCount: 1 
      }, 
      { 
        name: 'image', 
        //maxCount: 1 
      },
      {
        name: 'pdf', 
        //maxCount: 1 

      },
      {
        name: 'attachment', 
        //maxCount: 1 

      }
    ]
  )
);






const userroute=require('./routes/user');
const adminroute=require('./routes/admin');




app.get('/',(req,res)=>{
  if(req.session.loggedIn){
    if(req.session.user.level=='admin'){
      return res.redirect('/admin/dashboard');

    }
    else{
      return res.redirect('/user/dashboard');
    }

  }

  let error=req.flash('error')
  if(error.length>0){
    error=error[0];
  }
  else
  error=null;
  
  res.render('home',{pagetitle:'Home',errorMessage:error})
})
app.use('/user',userroute);
app.use('/admin',adminroute);
app.use((req,res)=>{
  res.render('404',{pagetitle:'NotFound'});
})

app.listen(4000,()=>console.log("SERVER ............."));




