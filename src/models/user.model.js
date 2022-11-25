module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("user", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        reset_password_token: {
            type: Sequelize.STRING,
        },
        reset_password_expires: {
            type: Sequelize.DATE,
        }

    });


    return User;
};
