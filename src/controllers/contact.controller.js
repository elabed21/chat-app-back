const db = require("../models");
const Contact = db.contacts;

const Op = db.Sequelize.Op;
 const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
 //var smtpTransport = require('nodemailer-smtp-transport');
const randtoken = require('rand-token');
// Create and Save a new Tutorial
exports.create = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        if (!email) {
            res.status(400).send({
                message: "Content can not be empty!"
            });

            return;
        }

 
        // Create a contact
        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone, 
            message: req.body.message,
            objet: req.body.objet
        };
 

        // Save Tutorial in the database
        Contact.create(contact)
            .then(data => {
                res.send(data);
                sendEmail(process.env.EMAIL,req.body);

            })
            process.env.USER
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the user."
                });
            });
    } catch (e) {
        console.error(e)
    }
};


// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Contact.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Book with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Book with id=" + id
            });
        });
};


// Update a user by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Contact.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

    const id = req.params.id;

    Contact.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Contact.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} User were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all User."
            });
        });
};



// Find all published users
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

    Contact.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Book."
            });
        });
};

function sendEmail(email,request) {
    try {
        var email = email;
         var mail = nodemailer.createTransport(smtpTransport({
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
        
        var name = request.name;
        var emailname = request.email;
        var phone = request.phone;
        var objet = request.objet;
        var message = request.message;
        
      
        var mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Reset Password Link - yassin.com',
            html: `<p> <b> Email from</b>  => ${name}</p><p> <b>Email</b> => ${emailname}</p>
            <p><b> phone</b> => ${phone}</p><p><b> objet</b> => ${objet}</p><p><b> message</b> => ${message}</p>`
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



