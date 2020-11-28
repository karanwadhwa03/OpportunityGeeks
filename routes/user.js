const express=require('express');
const router=express.Router();
const {check, body}=require('express-validator');
const usercontroller=require('./../controllers/user')
const isloggedin=require('./../middleware/islogged');


router.get('/dashboard',isloggedin,usercontroller.getdashboard)
router.get('/opportunities',isloggedin,usercontroller.getopportunities);
router.get('/opportunities/:id',isloggedin,usercontroller.getopportunitiessingle);
router.get('/myprofile',isloggedin,usercontroller.getmyprofile)
router.get('/forgotpassword',usercontroller.getforgotpassword)
router.get('/reset/:token',usercontroller.getnewpassword)
router.get('/api',usercontroller.getapi)
router.get('/changepassword',usercontroller.getchangepassword);
router.get('/blog',usercontroller.getblogpage);
router.get('/blog/:id',usercontroller.getsingleblogpage);



router.post('/signup',
    [check('email').isEmail().withMessage('Enter Valid Email'),
    body('confirmpassword').custom((value,{req})=>{
        if(value!=req.body.password){
            throw new Error('Password Have To match')
        }
        return true;
    })

    ]
,usercontroller.postsignup);





router.post('/signin',usercontroller.postsignin);
router.post('/logout',usercontroller.postlogout);
router.post('/profile',isloggedin,usercontroller.postprofile);
router.post('/forgotpassword',usercontroller.postforgotpassword)
router.post('/newpassword',usercontroller.postnewpassword);
router.post('/changepassword',usercontroller.postchangepassword);
router.post('/post',usercontroller.postpost);
router.post('/post/comment',usercontroller.postcomment);

router.post('/commentdelete',usercontroller.commentdelete);
router.post('/blogdelete',usercontroller.blogdelete);

module.exports=router;