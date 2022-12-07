module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
        objet: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.STRING,
        }

    });

    return Contact;
};