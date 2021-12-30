const express = require('express');
const ExpressError = require("../utils/ExpressError");
const CatchAsync = require("../utils/CatchAsync");
const deathintimation = require('../models/deathintimation');
const restoration = require('../models/restoration');
const eightyYears = require('../models/eightyYears');
const eightyFive = require('../models/eightyFive');
const ninety = require('../models/ninety');
const ninetyfive = require('../models/ninetyfive');
const User= require('../models/user');
const Visitor= require('../models/Visitor');
const Notifications= require('../models/notifications')
const {isLoggedIn} = require('../middleware')
const fast2sms = require('fast-two-sms');
var Recaptcha = require('express-recaptcha').RecaptchaV2;
var recaptcha = new Recaptcha('6LdJfx0dAAAAANS-m5-JlP7J3N7BfDOSOM_2Qdl-', '6LdJfx0dAAAAACAd5MQ81O-IlnvyQQhgA1BrDOhg', {callback:'cb'});
const {validateDeathIntimationSchema, validateRestorationSchema, validateEightySchema, validateEightyFiveSchema, validateNinetySchema, validateNinetyFiveSchema}= require('../validationSchemas')
const multer = require('multer');
const {storage}= require('../cloudinary')
const {cloudinary} = require('../cloudinary');

const upload = multer({storage})
const router = express.Router();

const deathIntimationValidation= (req, res, next) =>{
    const {error}= validateDeathIntimationSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const restorationValidation= (req, res, next) =>{
    const {error}= validateRestorationSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const eightyValidation= (req, res, next) =>{
    const {error}= validateEightySchema.validate(req.body);
    if(error){
        const msg= error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const eightyFiveValidation= (req, res, next) =>{
    const {error}= validateEightyFiveSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const ninetyValidation= (req, res, next) =>{
    const {error}= validateNinetySchema.validate(req.body);
    if(error){
        const msg= error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
const ninetyFiveValidation= (req, res, next) =>{
    const {error}= validateNinetyFiveSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.get('/deathintimation', recaptcha.middleware.render, (req, res) =>{
    res.render('user/death_public');
})
router.post('/deathintimation', upload.array('deathdetails', 2), recaptcha.middleware.verify, deathIntimationValidation, CatchAsync(async(req, res) =>{
    if(req.recaptcha.error){
        req.flash('error', 'Captcha Error!') 
        return res.redirect('/')
    }else{
        try{
            let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
            const date= new Date(req.body.dateofdeath);
            let dateofDeath= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
            const application_date= new Date();
            let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
            const newIntimation = new deathintimation({
                ref: referenceNumber,
                application_type: "Death Intimation",
                PPO: req.body.ppoNo,
                name: req.body.name,
                dateofdeath: dateofDeath,
                bankname: req.body.bankname,
                branchname: req.body.branchname,
                accountno: req.body.acno,
                idno: req.body.id,
                fileno: req.body.fileno,
                applicantname: req.body.applicant,
                application_date: applicationDate,
                relation: req.body.relation,
                mobileno: req.body.mobile,
                ppo_copy: req.files[0].path,
                ppofilename: req.files[0].filename,
                deathcertificate: req.files[1].path,
                deathfilename: req.files[1].filename,
                status: 'Received',
            })
            if(req.isAuthenticated()){
                foundUser=  await User.findOne({id: req.user.id});
                if(foundUser.deathintimation){
                    req.flash('error', 'You have already submitted death intimation')
                    return res.redirect('/dashboard/death')
                }
                await newIntimation.save().then(() =>{
                    console.log("Intimation Received Successfully");
                })
                foundUser.deathintimation= newIntimation;
                await foundUser.save();
            }else{
                await newIntimation.save().then(() =>{
                    console.log("Intimation Received Successfully");
                })
            }
            
                const messageDeath= 'dear'+ ' '+ req.body.applicant+','+ '\n'+ 'your application of death intimation of'+ ' '+req.body.name+ ' '+'has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
                var options = {authorization : process.env.API_KEY , message : messageDeath,  numbers : [req.body.mobile]} 
                await fast2sms.sendMessage(options).then(() =>{
                console.log("Message Sent Successfully");
                })
                .catch((e)=>{
                    console.log(e);
                })
                req.flash('success', 'You have successfully submitted Death Intimation');
                if(req.isAuthenticated()){
                    res.redirect('/dashboard');
                }else{
                    res.redirect('/')
                }
        }catch(e){
            req.flash('error', e.message);
            res.send('/')
        }
    }
}))

router.get('/dashboard',isLoggedIn, CatchAsync(async(req, res) =>{
    const notifications= await Notifications.find({});
    res.render('user/dashboard', {notifications: notifications});
}))
router.get('/dashboard/death', isLoggedIn, (req, res) =>{
    res.render('user/death');
})

router.post('/dashboard/death', isLoggedIn, upload.single('death'), deathIntimationValidation, CatchAsync(async (req, res) =>{
    let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
    const date= new Date(req.body.dateofdeath);
    let dateofDeath= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    const application_date= new Date();
    let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
    const newIntimation = new deathintimation({
        ref: referenceNumber,
        application_type: "Death Intimation",
        PPO: req.body.ppoNo,
        name: req.body.name,
        dateofdeath: dateofDeath,
        bankname: req.body.bankname,
        branchname: req.body.branchname,
        accountno: req.body.acno,
        idno: req.body.id,
        fileno: req.body.fileno,
        applicantname: req.body.applicant,
        application_date: applicationDate,
        relation: req.body.relation,
        mobileno: req.body.mobile,
        ppo_copy: req.user.ppo_copy,
        ppofilename: req.user.ppo_name,
        deathcertificate: req.file.path,
        deathfilename: req.file.filename,
        status: 'Received',
        User: req.user
    })
        foundUser=  await User.findOne({id: req.user.id});
        if(foundUser.deathintimation){
            req.flash('error', 'You have already submitted death intimation')
            return res.redirect('/dashboard/death')
        }
        await newIntimation.save().then(() =>{
            console.log("Intimation Received Successfully");
        })
        foundUser.deathintimation= newIntimation;
        await foundUser.save();
    
    
        const messageDeath= 'dear'+ ' '+ req.body.applicant+','+ '\n'+ 'your application of death intimation of'+ ' '+req.body.name+ ' '+'has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
        var options = {authorization : process.env.API_KEY , message : messageDeath,  numbers : [req.body.mobile]} 
        await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
        })
        .catch((e)=>{
            console.log(e);
        })
        req.flash('success', 'You have successfully submitted Death Intimation');
        if(req.isAuthenticated()){
            res.redirect('/dashboard');
        }else{
            res.redirect('/')
        }
}))

router.get('/dashboard/restoration', isLoggedIn, (req, res) =>{
    res.render('user/restoration');
})
router.post('/dashboard/restoration', isLoggedIn, restorationValidation, CatchAsync(async(req, res) =>{
    let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
    const date= new Date(req.body.dateofbirth);
    let dateofBirth= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    const application_date= new Date();
    let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
    foundUser=  await User.findOne({id: req.user.id});
    if(foundUser.restoration){
        req.flash('error', 'You have already submitted application for restoration')
        res.redirect('/dashboard/restoration')
    }else{
        const newRestoration= new restoration({
            ref: referenceNumber,
            application_type: "Restoration",
            PPO: req.body.ppoNo,
            dateofbirth: dateofBirth,
            name: req.body.name,
            basic: req.body.basic,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountno: req.body.acno,
            idno: req.body.id,
            fileno: req.body.fileno,
            application_date: applicationDate,
            mobileno: req.body.mobile,
            status: 'received',
            User: req.user
        })
        await newRestoration.save().then(() =>{
            console.log("Intimation received successfully");
        })
        foundUser.restoration= newRestoration;
        await foundUser.save();
        const restorationMessage= 'dear'+ ' '+ req.body.name+','+ '\n'+ 'your application of Commutation Restoration has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
        var options = {authorization : process.env.API_KEY , message : restorationMessage,  numbers : [req.body.mobile]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        .catch((e)=>{
            console.log(e);
        })
        req.flash('success', 'Thank you for applying for restoration.');
        res.redirect('/dashboard');
    }
}))

router.get('/dashboard/agebenefit', isLoggedIn, (req, res) =>{
    res.render('user/agebenefit');
})
router.get('/dashboard/agebenefit/eighty', isLoggedIn, (req, res) =>{
    res.render('user/eighty');
})
router.post('/dashboard/agebenefit/eighty', upload.single('ageproof'), isLoggedIn, eightyValidation, CatchAsync(async(req, res) =>{
    let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
    const date= new Date(req.body.dateofbirth);
    let dateofBirth= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
    const application_date= new Date();
    let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
    foundUser=  await User.findOne({id: req.user.id});
    if(foundUser.eightyYears){
        req.flash('error', 'You have already submitted application for Eighty Years benefit')
        res.redirect('/dashboard/agebenefit/eighty')
    }else{
        const eightyApplication= new eightyYears({
            ref: referenceNumber,
            application_type: "Eighty years benefit",
            PPO: req.body.ppoNo,
            dateofbirth: dateofBirth,
            name: req.body.name,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountno: req.body.acno,
            idno: req.body.id,
            fileno: req.body.fileno,
            application_date: applicationDate,
            mobileno: req.body.mobile,
            ageproof: req.file.path,
            ageproof_filename: req.file.filename,
            status: 'received',
            User: req.user
        })
        await eightyApplication.save().then(() =>{
            console.log("Application received successfully");
        })
        foundUser.eightyYears =  eightyApplication;
        await foundUser.save();
        const eightyMessage= 'dear'+ ' '+ req.body.name+','+ '\n'+ 'your application for 80 years benefit has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
        var options = {authorization : process.env.API_KEY , message : eightyMessage,  numbers : [req.body.mobile]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        req.flash('success', 'You have successfully submitted application for eighty years age benefit ');
        res.redirect('/dashboard');
    }
}))

router.get('/dashboard/agebenefit/eightyfive', isLoggedIn, (req, res) =>{
    res.render('user/eightyfive');
})
router.post('/dashboard/agebenefit/eightyfive', upload.single('ageproof'), isLoggedIn, eightyFiveValidation, CatchAsync(async(req, res) =>{
    let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
    const date= new Date(req.body.dateofbirth);
    let dateofBirth= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
    const application_date= new Date();
    let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
    foundUser=  await User.findOne({id: req.user.id});
    if(foundUser.eightyFive){
        req.flash('error', 'You have already applied for Eighty Five years benefit');
        res.redirect('/dashboard/agebenefit/eightyfive');
    }else{
        const eightyFiveApplication= new eightyFive({
            ref: referenceNumber,
            application_type: "Eighty Five years benefit",
            PPO: req.body.ppoNo,
            dateofbirth: dateofBirth,
            name: req.body.name,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountno: req.body.acno,
            idno: req.body.id,
            fileno: req.body.fileno,
            application_date: applicationDate,
            mobileno: req.body.mobile,
            ageproof: req.file.path,
            ageproof_filename: req.file.filename,
            status: 'received',
            User: req.user
        })
        await eightyFiveApplication.save().then(() =>{
            console.log("Application received successfully");
        })
        foundUser.eightyFive = eightyFiveApplication;
        foundUser.save();
        const eightyFiveMessage= 'dear'+ ' '+ req.body.name+','+ '\n'+ 'your application for 85 years benefit has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
        var options = {authorization : process.env.API_KEY , message : eightyFiveMessage,  numbers : [req.body.mobile]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        req.flash('success', 'You have successfully submitted application for eighty five years benefit');
        res.redirect('/dashboard');
    }
}))

router.get('/dashboard/agebenefit/ninety', isLoggedIn, (req, res) =>{
    res.render('user/ninety');
})

router.post('/dashboard/agebenefit/ninety', upload.single('ageproof'), isLoggedIn, ninetyValidation, CatchAsync(async(req, res) =>{
    let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
    const date= new Date(req.body.dateofbirth);
    let dateofBirth= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    const application_date= new Date();
    let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
    foundUser=  await User.findOne({id: req.user.id});
    if(foundUser.ninety){
        req.flash('error', 'You have already applied for Ninety years benefit');
        res.redirect('/dashboard/agebenefit/ninety');
    }else{
        const ninetyApplication= new ninety({
            ref: referenceNumber,
            application_type: "Ninety years benefit",
            PPO: req.body.ppoNo,
            dateofbirth: dateofBirth,
            name: req.body.name,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountno: req.body.acno,
            idno: req.body.id,
            fileno: req.body.fileno,
            application_date: applicationDate,
            ageproof: req.file.path,
            ageproof_filename: req.file.filename,
            mobileno: req.body.mobile,
            status: 'received',
            User: req.user
        })
        await ninetyApplication.save().then(() =>{
            console.log("Application received successfully");
        })
        foundUser.ninety = ninetyApplication;
        foundUser.save();
        const ninetyMessage= 'dear'+ ' '+ req.body.name+','+ '\n'+ 'your application for 90 years benefit has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
        var options = {authorization : process.env.API_KEY , message : ninetyMessage,  numbers : [req.body.mobile]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        req.flash('success', 'You have successfully submitted application for ninety years benefit');
        res.redirect('/dashboard');
    }
}))
router.get('/dashboard/agebenefit/hundred', isLoggedIn, (req, res) =>{
    res.render('user/ninetyfive');
})
router.post('/dashboard/agebenefit/hundred', upload.single('ageproof'), isLoggedIn, ninetyFiveValidation, CatchAsync(async(req, res) =>{
    let referenceNumber= Math.floor(Math.random()*100000)* Math.floor(Math.random()*100000);
    const date= new Date(req.body.dateofbirth);
    let dateofBirth= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    const application_date= new Date();
    let applicationDate= application_date.getDate() + "/" + (application_date.getMonth()+1) + "/" + application_date.getFullYear();
    foundUser=  await User.findOne({id: req.user.id});
    if(foundUser.ninetyfive){
        req.flash('error', 'You have already applied for Hundred years benefit');
        return res.redirect('/dashboard/agebenefit/hundred');
    }else{
        const ninetyfiveApplication= new ninetyfive({
            ref: referenceNumber,
            application_type: "hundred years benefit",
            PPO: req.body.ppoNo,
            dateofbirth: dateofBirth,
            name: req.body.name,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountno: req.body.acno,
            idno: req.body.id,
            fileno: req.body.fileno,
            application_date: applicationDate,
            ageproof: req.file.path,
            ageproof_filename: req.file.filename,
            mobileno: req.body.mobile,
            status: 'received',
            User: req.user
        })
        await ninetyfiveApplication.save().then(() =>{
            console.log("Application received successfully");
        })
        foundUser.ninetyfive = ninetyfiveApplication;
        foundUser.save();
        const ninetyfiveMessage= 'dear'+ ' '+ req.body.name+','+ '\n'+ 'your application for 100 years benefit has been received successfuly. Your Reference Number is:' + referenceNumber+'.';
        var options = {authorization : process.env.API_KEY , message : ninetyfiveMessage,  numbers : [req.body.mobile]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        req.flash('success', 'You have successfully submitted application for Hundred years benefit');
        res.redirect('/dashboard');
    }
}))

router.get('/dashboard/lifecertificate', isLoggedIn, (req, res) =>{
    res.render('user/life-certificate')
})

router.get('/dashboard/aboutus', CatchAsync(async(req, res) =>{
    const visitors= await Visitor.findOne({name: 'localhost'});
    res.render('user/about_us', {visitors: visitors});
}))

router.get('/dashboard/forms', isLoggedIn, (req,res) =>{
    res.render('user/forms');
})

router.get('/dashboard/notifications', isLoggedIn, CatchAsync(async(req, res) =>{
    const notifications= await Notifications.find({});
    res.render('user/notifications', {notifications: notifications});
}))

router.get('/dashboard/myaccount', isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findOne({id: req.user.id});
    res.render('user/myaccount', {user: foundUser});
}))
router.put('/dashboard/myaccount', isLoggedIn, CatchAsync(async(req, res) =>{
    try{
        const foundUser= await User.findByIdAndUpdate(req.user._id, 
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            acno: req.body.acno,
            actype: req.body.actype,
            address: req.body.address,
            dob: req.body.dob,
            email: req.body.email,
            mobileno: req.body.mobileno
        });
        console.log(foundUser);
        req.flash('success', 'your details updated successfully');
        res.redirect('/dashboard/myaccount');
    }catch(e){
        res.send(e.message);
        console.log(e);
    }
}))
router.get('/dashboard/myaccount/ljkadkladklklawadadljkawlkjlkalkafllkaadlkkl', isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser = await User.findById(req.user._id).populate('restoration').populate('eightyYears').populate('eightyFive').populate('ninety').populate('ninetyfive').populate('deathintimation');
    res.send(JSON.stringify(foundUser));
}))
router.post('/dashboard/myaccount/changepic', isLoggedIn, upload.single('profilepic'), CatchAsync(async(req, res) =>{
    try{
        defaultURL= 'https://res.cloudinary.com/dn47bnyxc/image/upload/v1639839485/HooghlyOne/blank-profile-picture-973460_1280_bflzl2.png';
        if(req.user.profile_pic !== defaultURL){
            await cloudinary.uploader.destroy(req.user.pic_name);
        }
        const foundUser2 = await User.findByIdAndUpdate(req.user._id,
        {
            profile_pic: req.file.path,
            pic_name: req.file.filename,
        });
        foundUser2.save();
        req.flash('success', 'Profile picture changed successfully');
        res.redirect('/dashboard/myaccount');
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/dashboard/myaccount')
    }
}))

router.get('/dashboard/myaccount/restoration/view/:id',isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findById(req.user._id).populate('restoration');
    res.render('pdf/restoration_pdf', {user: foundUser});
}))
router.get('/dashboard/myaccount/deathintimation/view/:id',isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findById(req.user._id).populate('deathintimation');
    res.render('pdf/death_pdf', {user: foundUser});
}))
router.get('/dashboard/myaccount/eighty/view/:id',isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findById(req.user._id).populate('eightyYears');
    res.render('pdf/eighty_pdf', {user: foundUser});
}))
router.get('/dashboard/myaccount/eightyfive/view/:id',isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findById(req.user._id).populate('eightyFive');
    res.render('pdf/eightyfive_pdf', {user: foundUser});
}))
router.get('/dashboard/myaccount/ninety/view/:id',isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findById(req.user._id).populate('ninety');
    res.render('pdf/ninety_pdf', {user: foundUser});
}))
router.get('/dashboard/myaccount/hundred/view/:id',isLoggedIn, CatchAsync(async(req, res) =>{
    const foundUser= await User.findById(req.user._id).populate('ninetyfive');
    res.render('pdf/ninetyfive_pdf', {user: foundUser});
}))
module.exports = router;