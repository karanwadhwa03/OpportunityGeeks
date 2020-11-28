const express=require('express');
const router=express.Router();
const admincontroller=require('./../controllers/admin')
const islogged=require('../middleware/isAdmin');  //FOR ADMIN
const isloggedIn=require('./../middleware/islogged')



router.get('/dashboard',isloggedIn,islogged,admincontroller.getdashboard);
router.get('/createplacement',isloggedIn,islogged,admincontroller.getcreateplacement);
router.get('/allusers',isloggedIn,islogged,admincontroller.getallusers);
router.get('/filterusers',isloggedIn,islogged,admincontroller.filterusers);
router.get('/profile/:id',isloggedIn,islogged,admincontroller.getsingleprofile);

router.post('/createplacement',isloggedIn,islogged,admincontroller.postcreateplacement);

router.post('/companydelete',isloggedIn,islogged,admincontroller.deletecompany)
router.get('/editplacement/:id',isloggedIn,islogged,admincontroller.editcompany)

router.post('/editplacement',isloggedIn,islogged,admincontroller.posteditplacement)


router.post('/filterusers',isloggedIn,islogged,admincontroller.postfilterusers);


router.get('/makeadmin',isloggedIn,islogged,admincontroller.getmakeadmin);


router.get('/filter',admincontroller.getfilter);

router.post('/sendmail',isloggedIn,islogged,admincontroller.sendmail);


router.post('/makeadmin',isloggedIn,islogged,admincontroller.postmakeadmin);




module.exports=router;