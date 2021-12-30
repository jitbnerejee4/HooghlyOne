module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo= req.originalUrl;
        req.flash('error', 'Please signup or login to continue');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAdmin = (req, res, next) =>{
    if(req.isAuthenticated() && req.user.role === 2){
        next();
    }else{
        req.session.returnTo= req.originalUrl;
        req.flash('error', 'You are not authorized to view this page');
        return res.redirect('/dashboard');
    }
}
