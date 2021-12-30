const express = require('express');
const CatchAsync = require("../utils/CatchAsync");
const deathintimation = require('../models/deathintimation');
const restoration = require('../models/restoration');
const eightyYears = require('../models/eightyYears');
const eightyFive = require('../models/eightyFive');
const User= require('../models/user');
const Visitor= require('../models/Visitor');
const Notifications = require('../models/notifications');
const deathMessage= require('../messages/deathmessage');
const restorationMessage = require('../messages/restoration_message')
const eightyMessage = require('../messages/eightymessage');
const eightyfiveMessage= require('../messages/eightyfivemessage');
const ninetyMessage = require('../messages/ninetymessage');
const hundredMessage = require('../messages/hundredmessage');
const ninety = require('../models/ninety');
const hundred = require('../models/ninetyfive');
const {isLoggedIn, isAdmin} = require('../middleware');
const fast2sms = require('fast-two-sms');
const multer = require('multer');
const {storage}= require('../cloudinary')
const {cloudinary} = require('../cloudinary');

const upload = multer({storage})
let temp = 0;
const router = express.Router();

router.get('/admin-dashboard', isAdmin, CatchAsync(async(req, res) =>{
    const notifications= await Notifications.find({});
    res.render('admin/admin-dashboard', {notifications: notifications})
}))

router.get('/admin-dashboard/death-intimations', isAdmin, CatchAsync(async (req, res) =>{
    const intimations= await deathintimation.find({})
    res.render('admin/death_intimations', {intimations: intimations})
}))

router.get('/admin-dashboard/death-intimations/:id', isAdmin, CatchAsync(async (req, res) =>{
    const {id}=req.params;
    const foundIntimation= await deathintimation.findById(id).populate('User');
    res.render('admin/show_intimations', {foundIntimation: foundIntimation})
}))

router.put('/admin-dashboard/death-intimations/:id',isAdmin, CatchAsync(async (req, res) =>{
    const {id}=req.params;
    const foundIntimation= await deathintimation.findByIdAndUpdate(id, {status: req.body.btn, useFindAndModify: false})
    const applicant= foundIntimation.applicantname;
    const pensioner= foundIntimation.name;
    const ref= foundIntimation.ref;
    const successMessage= deathMessage.message(req.body.btn, applicant, pensioner, ref);
    var options = {authorization : process.env.API_KEY , message : successMessage,  numbers : [foundIntimation.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    res.redirect('/admin-dashboard/death-intimations');
}))
router.delete('/admin-dashboard/death-intimations/delete/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    const foundIntimation= await deathintimation.findByIdAndDelete(id);
    if(foundIntimation.deathfilename){
        await cloudinary.uploader.destroy(foundIntimation.deathfilename, function(error,result) {
        console.log(result, error) });  
    }
    if(!foundIntimation.User){
        await cloudinary.uploader.destroy(foundIntimation.ppofilename, function(error,result) {
        console.log(result, error) }); 
    }
    req.flash('success', 'Death Intimation deleted successfully!');
    res.redirect('/admin-dashboard/death-intimations');
}))

router.get('/admin-dashboard/restorations', isAdmin, CatchAsync(async(req,res) =>{
    const restorations= await restoration.find({})
    res.render('admin/view_restorations', {restorations: restorations})
}))
router.get('/admin-dashboard/restorations/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id}=req.params;
    const foundRestoration= await restoration.findById(id).populate('User');;
    res.render('admin/show_restoration', {foundRestoration: foundRestoration})
}))
router.put('/admin-dashboard/restorations/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id}= req.params;
    const foundRestoration= await restoration.findByIdAndUpdate(id, {status: req.body.btn, useFindAndModify: true})
    const pensioner= foundRestoration.name;
    const ref= foundRestoration.ref;
    const successMessage= restorationMessage.message(req.body.btn, pensioner, ref);
    var options = {authorization : process.env.API_KEY , message : successMessage,  numbers : [foundRestoration.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    res.redirect('/admin-dashboard/restorations');
}))
router.delete('/admin-dashboard/restorations/delete/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    await restoration.findByIdAndDelete(id);
    req.flash('success', 'Restoration Application deleted successfully!');
    res.redirect('/admin-dashboard/restorations');
}))

router.get('/admin-dashboard/agebenefit', isAdmin, (req, res) =>{
    res.render('admin/age-benefits')
})

router.get('/admin-dashboard/agebenefit/eighty-applications', isAdmin, CatchAsync(async(req, res) =>{
    const eightyApplications= await eightyYears.find({})
    res.render("admin/eighty_applications", {eightyApplications: eightyApplications});
}))
router.get('/admin-dashboard/agebenefit/eighty-applications/:id', isAdmin, async(req, res) =>{
    const {id}= req.params;
    const foundEightyApplication= await eightyYears.findById(id).populate('User');
    res.render('admin/view_eighty', {foundEightyApplication: foundEightyApplication});
})
router.put('/admin-dashboard/agebenefit/eighty-applications/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id}= req.params;
    const foundApplication= await eightyYears.findByIdAndUpdate(id, {status: req.body.btn, useFindAndModify: true})
    const pensioner= foundApplication.name;
    const ref= foundApplication.ref;
    const successMessage= eightyMessage.message(req.body.btn, pensioner, ref)
    var options = {authorization : process.env.API_KEY , message : successMessage,  numbers : [foundApplication.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    res.redirect('/admin-dashboard/agebenefit/eighty-applications');

}))
router.delete('/admin-dashboard/agebenefit/eighty-applications/delete/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    await eightyYears.findByIdAndDelete(id);
    req.flash('success', 'Eighty Application deleted successfully!');
    res.redirect('/admin-dashboard/agebenefit/eighty-applications');
}))


router.get('/admin-dashboard/agebenefit/eightyfive-applications', isAdmin, CatchAsync(async(req, res) =>{
    const applications= await eightyFive.find({})
    res.render('admin/eightyfive_applications', {applications: applications});
}))
router.get('/admin-dashboard/agebenefit/eightyfive-applications/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id}= req.params;
    const foundApplication= await eightyFive.findById(id).populate('User');
    res.render('admin/view_eightyfive', {foundApplication: foundApplication})
}))
router.put('/admin-dashboard/agebenefit/eightyfive-applications/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    const foundApplication= await eightyFive.findByIdAndUpdate(id, {status: req.body.btn, useFindAndModify: false})
    const pensioner= foundApplication.name;
    const ref= foundApplication.ref;
    const successMessage= eightyfiveMessage.message(req.body.btn, pensioner, ref)
    var options = {authorization : process.env.API_KEY , message : successMessage,  numbers : [foundApplication.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    res.redirect('/admin-dashboard/agebenefit/eightyfive-applications');
}))
router.delete('/admin-dashboard/agebenefit/eightyfive-applications/delete/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    await eightyFive.findByIdAndDelete(id);
    req.flash('success', 'Eighty Five years Application deleted successfully!');
    res.redirect('/admin-dashboard/agebenefit/eightyfive-applications');
}))


router.get('/admin-dashboard/agebenefit/ninety-applications', isAdmin, CatchAsync(async(req, res) =>{
    const applications= await ninety.find({})
    res.render('admin/ninety_applications', {applications: applications});
}))
router.get('/admin-dashboard/agebenefit/ninety-applications/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id}= req.params;
    const foundApplication= await ninety.findById(id).populate('User');
    res.render('admin/view_ninety', {foundApplication: foundApplication})
}))
router.put('/admin-dashboard/agebenefit/ninety-applications/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    const foundApplication= await ninety.findByIdAndUpdate(id, {status: req.body.btn, useFindAndModify: false})
    const pensioner= foundApplication.name;
    const ref= foundApplication.ref;
    const successMessage= ninetyMessage.message(req.body.btn, pensioner, ref)
    var options = {authorization : process.env.API_KEY , message : successMessage,  numbers : [foundApplication.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    res.redirect('/admin-dashboard/agebenefit/ninety-applications');
}))
router.delete('/admin-dashboard/agebenefit/ninety-applications/delete/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    await ninety.findByIdAndDelete(id);
    req.flash('success', 'Ninety Years Application deleted successfully!');
    res.redirect('/admin-dashboard/agebenefit/ninety-applications');
}))

router.get('/admin-dashboard/agebenefit/hundred-applications', isAdmin, CatchAsync(async(req, res) =>{
    const applications= await hundred.find({})
    res.render('admin/hundred_applications', {applications: applications});
}))
router.get('/admin-dashboard/agebenefit/hundred-applications/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id}= req.params;
    const foundApplication= await hundred.findById(id).populate('User');
    res.render('admin/view_hundred', {foundApplication: foundApplication})
}))
router.put('/admin-dashboard/agebenefit/hundred-applications/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    const foundApplication= await hundred.findByIdAndUpdate(id, {status: req.body.btn, useFindAndModify: false})
    const pensioner= foundApplication.name;
    const ref= foundApplication.ref;
    const successMessage= hundredMessage.message(req.body.btn, pensioner, ref)
    var options = {authorization : process.env.API_KEY , message : successMessage,  numbers : [foundApplication.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    res.redirect('/admin-dashboard/agebenefit/hundred-applications');
}))
router.delete('/admin-dashboard/agebenefit/hundred-applications/delete/:id', isAdmin, CatchAsync(async(req,res) =>{
    const {id}= req.params;
    await hundred.findByIdAndDelete(id);
    req.flash('success', 'Hundred Years Application deleted successfully!');
    res.redirect('/admin-dashboard/agebenefit/hundred-applications');
}))


router.get('/admin-dashboard/search', isAdmin, CatchAsync(async(req, res) =>{
    const Users = await User.find({});
    res.render('admin/search', {users: Users})
}))
router.get('/admin-dashboard/search/sendmessage/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id} = req.params;
    temp= id;
    foundUser= await User.findById(id);
    res.render('admin/send_message', {user: foundUser})
}))
router.post('/admin-dashboard/search/sendmessage/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id} = req.params;
    message= req.body.message;
    foundUser= await User.findById(id);
    var options = {authorization : process.env.API_KEY , message : message,  numbers : [foundUser.mobileno]} 
    await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
    })
    .catch((e)=>{
        console.log(e);
    })
    req.flash("success", "Message sent successfully to" + " " + foundUser.username);
    res.redirect('/admin-dashboard/search')
    
}))
router.get('/admin-dashboard/approval', isAdmin, CatchAsync(async(req, res) =>{
    const users = await User.find({isApproved: false})
    res.render('admin/approval', {users: users});
}))
router.get('/admin-dashboard/approval/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id} = req.params;
    const foundUser= await User.findById(id);
    res.render('admin/pending', {foundUser: foundUser})
}))
router.post('/admin-dashboard/approval/:id', isAdmin, CatchAsync(async(req, res) =>{
    const {id} = req.params;
    const foundUser= await User.findById(id);
    if(req.body.btn === "approved"){
        foundUser.isApproved = true;
        await foundUser.save();
        var options = {authorization : process.env.API_KEY , message : "Dear" + foundUser.firstname + "," + "Congratulations! your sign up request is approved. Now you can login with your credentials",  numbers : [foundUser.mobileno]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        .catch((e)=>{
            req.flash('error', e);
            res.send('/admin-dashboard/approval');
        })
        req.flash('success', 'sign up request approved');
        res.redirect('/admin-dashboard/approval');
    }else{
        const deleteUser= await User.findByIdAndDelete(id);
        await cloudinary.uploader.destroy(deleteUser.ppo_name);
        var options = {authorization : process.env.API_KEY , message : "Dear" + deleteUser.firstname + "," + "Your sign up request is rejected. Please contact us for clarification",  numbers : [deleteUser.mobileno]} 
        await fast2sms.sendMessage(options).then(() =>{
            console.log("Message Sent Successfully");
        })
        .catch((e)=>{
            req.flash('error', e);
            res.send('/admin-dashboard/approval');
        })
        req.flash('success', 'sign up request rejected');
        res.redirect('/admin-dashboard/approval');
    }
}))


router.get('/admin-dashboard/aboutus', isAdmin, CatchAsync(async(req, res) =>{
    const visitors= await Visitor.findOne({name: 'localhost'});
    res.render('admin/about_us', {visitors: visitors});
}))

router.get('/admin-dashboard/notifications', isAdmin, CatchAsync(async(req, res) =>{
    const notifications= await Notifications.find({});
    res.render('admin/notifications', {notifications: notifications});
}))
router.get('/admin-dashboard/notifications/insert', isAdmin, (req, res) =>{
    res.render('admin/insert_notification')
})
router.post('/admin-dashboard/notifications/insert',isAdmin, upload.single('notification'), CatchAsync(async(req, res) =>{
    const date= new Date(req.body.date);
    let dateofNotification= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
    const newNotification = new Notifications({
        title: req.body.title,
        date: dateofNotification,
        url: req.file.path,
        filename: req.file.filename
    })
    await newNotification.save();
    req.flash('success', 'Notification uploaded successfully');
    res.redirect('/admin-dashboard/notifications')
}))
router.delete('/admin-dashboard/notifications/delete/:id', CatchAsync(async(req, res) =>{
    const {id}= req.params;
    const foundNotification= await Notifications.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(foundNotification.filename, function(error,result) {
        console.log(result, error) });
    req.flash('success', 'Notification deleted successfully!');
    res.redirect('/admin-dashboard/notifications');
}))
module.exports = router;