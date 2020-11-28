module.exports=(req,res,next)=>{
    if(req.session.user.level=='admin'){
        return next();
        
    }
    req.flash('error','First Login With Admin Credentials')
    return res.redirect('/');
}