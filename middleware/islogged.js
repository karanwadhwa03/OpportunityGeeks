module.exports=(req,res,next)=>{
    if(req.session.loggedIn){
        //console.log('lllll');
        return next();
    }
    else{
        req.flash('error','Please Login Your Account First');
        res.redirect('/');
    }

}