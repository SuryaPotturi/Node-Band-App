const User = require('../Sequelize.js').User;
const Band = require('../Sequelize').Band;
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");


//nodemailer otp implementation
module.exports = {

    sendmail: function (req, res, email, logintoken) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: 'band@gmail.com',
                pass: 'band123_'
            }
        });
        const message = {
            from: 'support@band.com',
            to: email,
            subject: 'Forgot Password',
            text: "Your OTP is: " + logintoken
        };
        transport.sendMail(message, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    },


    //CRUD band functionalities

    editBands: function (req, res) {
        Band.findOne({
            where: { id: req.params.id }
        }).then(
            bands => {
                var band = {
                    id: bands.id,
                    bandname: bands.bandname,
                   
                };
                res.render("edit", {
                    band: band
                })
            }
        )
    },

        editBand: function (req, res, id, bandname) {

        Band.findOne({
            where: { id: id }
        }).then(
            band => {
                band.update({
                    bandname: bandname,
                     number_of_members: no_of_members
                }).then(setTimeout(function () {
                    Band.findAll({ where: { userUserId: req.session.userid } }).then(
                        bands => {
                            req.session.band = bands;
                            res.redirect("/");
                        }
                    )
                }, 1000))
            }
        );
    },

    deleteBands: function (req, res, bid) {
        Band.destroy({
            where: { id: bid }
        }).then(
            Band.findAll({ where: { userUserId: req.session.userid } }).then(
                bands => {
                    req.session.band = bands;
                    res.redirect("/");
                }
            )
        )
    },

    //USER Authorisation
    authUser: function (req, res, useremail, password) {
        User.findOne({
            where: { useremail: useremail, upassword: password }
        }).then(
            user => {
                if (user) {
                    req.session.user = user;
                    req.session.userid = user.user_id;
                }
                else {
                    req.session.LoginFailureStatus = "No User exist :(";
                    req.session.SighnupSuccessStatus = '';
                }
                res.redirect("/");
            }
        );
    },


    //Add bands 
        addBands: function (req, res, bandname) {

        Band.create({
            bandname: bandname,
            userUserId: req.session.userid
        }).then(setTimeout(function () {
            Band.findAll({ where: { userUserId: req.session.userid } }).then(
                bands => {
                    req.session.band = bands;
                    res.redirect("/");
                }
            )
        }, 1000)
        );
    },

    //adduser registration
    addUser: function (req, res, username, password, useremail, userdob) {
        User.create({
            username: username,
            upassword: password,
            userdob: userdob,
            useremail: useremail
        }).then(
            req.session.SighnupSuccessStatus = "Account Create Successfully",
            res.redirect("/")
        );
    },

    //forgot password
    forgotpassword: function (req, res, email) {
        let logintoken = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        var d = new Date();
        var validTill = d.getTime() + 60000;
        User.update({
            userotp: logintoken,
            validTill: validTill
        }, {
            where: { useremail: email }
        }).then(
            user => {
                if (user != 0) {
                    this.sendmail(req, res, email, logintoken);
                    req.session.useremail = email;
                    res.render("login", {
                        login : "none",
                        forgot: "none",
                        new: "block",
                        otpmessageShow: "none",
                    });
                }
                else {
                    res.render("login", {
                        login : "none",
                        forgot: "block",
                        new: "none",
                        message: "User doesnot exist"
                    });
                }
            }
        )
    },

    //update password
    updatepassword: function(req, res, email, newpassword){
        User.update({
            upassword: newpassword,
            validTill: 0,
            userotp: 0
        }, {
            where: { useremail: email }
        }).then(
            res.redirect("/")
        )
    },

    //reset password
    newpassword: function(req, res, email, otp, newpassword){
        var d = new Date();
        var curtime = d.getTime();
        User.findOne({
            where: {useremail: email}
        }).then(
            user => {
                if(user.validTill > curtime && user.userotp == otp){
                    req.session.SighnupSuccessStatus = '',
                    req.session.SighnupFailureStatus ='',
                    req.session.LoginFailureStatus = '',
                    this.updatepassword(req, res, email, newpassword);   
                }
                else{
                    res.render("login", {
                        login : "none",
                        forgot: "none",
                        new: "block",
                        otpmessageShow: "block",
                        otpmessage: "Wrong OTP or OTP is expired"
                    });
                }
            }
        )
    },


    //logout
    logout: function (req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}    