module.exports = (sequelize, Sequelize) => {

    const Messages = sequelize.define("messages", {
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        message_from: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        message_to: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        message_content: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        read: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default : false,
        },
    });


    return Messages;
};
