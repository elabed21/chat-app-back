const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const db = require("../models");
const User = db.users;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const tokenHelper = require('../helpers/token');

exports.login = async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await User.findOne({where: {email: username}});
        if (!user?.dataValues) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            res.status(401).send({
                message: error
            });
        }

        const isEqual = await bcrypt.compare(password, user.dataValues.password);

        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = tokenHelper.generateToken(
            {
                username: user.dataValues.username,
                userId: user.dataValues.id,
            },
            '24h'
        )

        res.status(200).json({token: token, user: user.dataValues});

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.error(err);
    }


};
// Update a user by the id in the request
exports.updatePassword = async (req, res) => {
    const startnow = Date.now();
    try {

        //find the token
        const user = {
            email: req.body.email,
            password: req.body.password
        };
        console.log("req.body.password", req.body.password)
        const useremail = await User.findOne({where: {email: req.body.email}});

        var password_expires = Date.parse(useremail.reset_password_expires);

        if (useremail?.dataValues && (password_expires > startnow)) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            useremail.update({password: hashedPassword}).then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving  link ."
                });
            });

        } else {
            const error = new Error('A user with this email could not be found. or expired link  ');
            error.statusCode = 401;
            res.status(401).send({
                message: error
            });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.error(err);
    }

};
// Update a user by the id in the request

exports.forgotPassword = async (req, res, next) => {
    // Create a book
    const user = {
        email: req.body.email
    };

    const email = req.body.email

    try {

        const useremail = await User.findOne({where: {email: user.email}});

        if (useremail.dataValues) {
            //res.json("Email already registered")
            // console.log(useremail.dataValues)
            const token = jwt.sign(
                {user_id: user.id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            //let user_id = useremail.dataValues.id;
            // console.log("useremail", user_id)

            sendEmail(user.email, token);
            //res.json(token)
            useremail.update({
                reset_password_token: token,
                reset_password_expires: Date.now() + 60 * 60 * 2
            }).then(data => {
                res.send(data);
            })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving Book."
                    });
                });


        } else {

            res.json({
                status: "failed",
                message: "No account with the supplied email exists !"

            });
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            console.log(err)
        }
        next(err);
    }

};

function sendEmail(email, token) {
    try {
        const mail = nodemailer.createTransport(smtpTransport({
            service: 'Gmail',
            secureConnection: false,
            port: 587,
            requiresAuth: true,
            domains: ["gmail.com", "googlemail.com"],
            auth: {
                user: process.env.USER, // Your email id
                pass: process.env.PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        }));

        //const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        const link = `${process.env.BASE_URL_ANG}/authentication/update-forget?token=${token}&email=${email}`;
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Reset Password Link - Tutsmake.com',
            html: `<p>You requested for reset password, kindly use this <a href= "${link}">link</a> to reset your password</p>`
        };

        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("email sent sucessfully");

            }
        });
    } catch (err) {
        console.error(err);
    }

}
