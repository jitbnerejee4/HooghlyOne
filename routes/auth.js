const express = require('express');
const CatchAsync = require("../utils/CatchAsync");
const User = require('../models/user');
const router = express.Router();
var Recaptcha = require('express-recaptcha').RecaptchaV2;
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
var randomString = require("randomstring");
const {isLoggedIn} = require('../middleware');
const fast2sms = require('fast-two-sms');
const v3SiteKey= '6Lcw2RwdAAAAAJ0nMgTiSk9Mcwql3vvzksa224pv';
const v3SecretKey= '6Lcw2RwdAAAAAIkWn_p0j0jGL911gdM3Dj9P-tfL';
const v2SiteKey= '6LdJfx0dAAAAANS-m5-JlP7J3N7BfDOSOM_2Qdl-';
const v2SecretKey= '6LdJfx0dAAAAACAd5MQ81O-IlnvyQQhgA1BrDOhg';
const multer = require('multer');
const {storage}= require('../cloudinary')
const {cloudinary} = require('../cloudinary');
const upload = multer({storage});
let randomOtp = 0;
let mobile = 0;
var recaptcha = new Recaptcha('6LdJfx0dAAAAANS-m5-JlP7J3N7BfDOSOM_2Qdl-', '6LdJfx0dAAAAACAd5MQ81O-IlnvyQQhgA1BrDOhg', {callback:'cb'});


router.get('/register',  recaptcha.middleware.render, CatchAsync(async(req, res) =>{
    if(req.isAuthenticated()){
        res.redirect('/dashboard')
    }else{
        res.render('user/register', { captcha:res.recaptcha });
    }
}))

router.get('/verify-id', CatchAsync(async(req, res) =>{
    const users = await User.find({})
    res.send(JSON.stringify(users))
}))

router.post('/register', upload.single('ppocopy'), recaptcha.middleware.verify, CatchAsync(async(req,res) =>{
if(req.recaptcha.error){
    req.flash('error', 'Captcha Error!')
    return res.redirect('/register')
}else{
    try{
        const newUser = new User({
            id: req.body.idno,
            username: req.body.username,
            ppono: req.body.ppono,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobileno: req.body.mobileno,
            ppo_copy: req.file.path,
            ppo_name: req.file.filename,
            profile_pic: 'https://res.cloudinary.com/dn47bnyxc/image/upload/v1639839485/HooghlyOne/blank-profile-picture-973460_1280_bflzl2.png',
            pic_name: 'blank-profile-picture-973460_1280_bflzl2',
            role: 0
        })
        const registeredUser = await User.register(newUser, req.body.password)
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
        })
        if(!req.user.isApproved && req.user.role === 0){
            req.flash('error', 'your signup request is pending approval. Please keep patience');
            req.logout()
           res.redirect('/')
        }else{
            res.redirect('/dashboard')
        }
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register');
    }
}
}))

router.get('/login', recaptcha.middleware.render, CatchAsync(async(req, res, next) =>{
    if(req.isAuthenticated()){
        if(req.user.role === 2){
            return res.redirect('/admin-dashboard')
        }else if(req.user.role === 0){
            return res.redirect('/dashboard')
        }
    }else{
        res.render('user/login', { captcha:res.recaptcha });
    }
}))

router.post('/login', recaptcha.middleware.verify, passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'} ), CatchAsync(async(req, res) =>{
    if(req.recaptcha.error){
        req.flash('error', 'Captcha Error!')
        req.logout();
        return res.redirect('/login')
    }else{
        if(!req.user.isApproved && req.user.role === 0){
            req.flash('error', 'your signup request is pending approval. Please keep patience');
            req.logout()
            res.redirect('/')
        }else{
            if(req.user.role === 2){
                res.redirect('/admin-dashboard')
            }else{
                const redirectUrl= req.session.returnTo || '/dashboard';
                delete req.session.returnTo;
                res.redirect(redirectUrl);
            }
        }
    }
}))
router.get('/forgot-password', CatchAsync(async(req, res) =>{
    res.render('forgot-password');
}))
router.post('/forgot-password', CatchAsync(async(req, res) =>{
    mobile = req.body.mobile;
    const foundUser= await User.findOne({mobileno: mobile});
    console.log(foundUser);
    if(!foundUser){
        req.flash('error', 'No records found');
        res.redirect('/register');
    }else{
        random = randomString.generate();
        const secret= process.env.JWT_SECRET + random;
        const payload = {
            mobileNo: foundUser.mobileno,
            id: foundUser._id
        }
        const token = jwt.sign(payload, secret, {expiresIn: '15m'})
        const link = '/reset-password/'+foundUser._id+'/'+token;
        randomOtp= Math.floor(Math.random()*100000);
        var options = {authorization : process.env.API_KEY , message : "Dear" + foundUser.firstname + "," + "Your password reset otp is:" + randomOtp,  numbers : [foundUser.mobileno]} 
        await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
        })
        res.redirect(link);
    }
}))

router.get('/reset-password/:id/:token', CatchAsync(async(req, res) =>{
    const{id, token}= req.params;
    const foundUser= await User.findById(id);
    if(!foundUser){
        req.flash('error', 'no records found')
        return res.redirect('/login');
    }
    const secret= process.env.JWT_SECRET + random;
    try{
        const payload= jwt.verify(token, secret);
        res.render('otp-verification');
    }catch(e){
        console.log(e);
        res.send(e.message);
    }
}))
router.post('/reset-password/:id/:token', CatchAsync(async(req, res) =>{
    const{id, token}= req.params;
    const foundUser= await User.findById(id);
    if(!foundUser){
        req.flash('error', 'no records found')
        return res.redirect('/login');
    }
    const secret= process.env.JWT_SECRET + random;
    try{
        const payload= jwt.verify(token, secret);
        let otp = req.body.otp;
        otp = Number(otp);
        if(otp !== randomOtp){
            res.send('you have entered wrong OTP');
        }else{
            // const foundUser= await User.findOne({mobileno: mobile});
            const secret= process.env.JWT_SECRET + random;
            const payload = {
                mobileNo: foundUser.mobileno,
                id: foundUser._id
            }
            const token = jwt.sign(payload, secret, {expiresIn: '15m'})
            const link = '/reset-password/'+foundUser._id+'/'+token;
            res.redirect(link+'/change-password');
        }
    }catch(e){
        console.log(e);
        res.send(e.message)
    }
    
}))
router.get('/reset-password/:id/:token/change-password', CatchAsync(async(req, res) =>{
    const{id, token}= req.params;
    const foundUser= await User.findById(id);
    if(!foundUser){
        req.flash('error', 'no records found')
        return res.redirect('/login');
    }
    const secret= process.env.JWT_SECRET + random;
    try{
        const payload= jwt.verify(token, secret);
        res.render('change-password');
    }catch(e){
        console.log(e);
        res.send(e.message);
    }
}))
router.post('/reset-password/:id/:token/change-password', CatchAsync(async(req, res) =>{
    const foundUser= await User.findOne({mobileno: mobile});
    try{
        await foundUser.setPassword(req.body.newPassword);
        await foundUser.save();
        req.flash('success', 'password changed successfully')
        res.redirect('/login');
    }catch(e){
        console.log(e)
        res.send(e.message);
    }
}))
router.post('/dashboard/change-password', isLoggedIn, CatchAsync(async(req, res) =>{
    if(req.body.newpass !== req.body.confirmpass){
        req.flash('error', 'new password and confirm password mismatch');
        return res.redirect('/dashboard/myaccount');
    }
    try{
        const foundUser= await User.findById(req.user._id);
        await foundUser.changePassword(req.body.oldpass, req.body.confirmpass);
        await foundUser.save();
        req.logout();
        req.flash('success', 'password changed successfully please login again');
        res.redirect('/login');
    }catch(e){
        res.send(e.message);
        console.log(e);
    }
}))

router.get('/logout',(req, res) =>{
    req.logout();
    res.redirect('/');  
})

module.exports = router;