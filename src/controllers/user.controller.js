const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var jwt = require('jsonwebtoken');
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

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a book
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword

        };

        const useremail = await User.findOne({where: {email: user.email}});
        if (useremail) {
            res.json("Email already registered")
            return;
        }

        // Save Tutorial in the database
        User.create(user)
            .then(data => {
                res.send(data);

            })

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
    User.findByPk(id)
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

    User.update(req.body, {
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

    User.destroy({
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
    User.destroy({
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

    User.findAll({where: condition})
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




