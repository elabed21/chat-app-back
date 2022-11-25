const db = require("../models/index");
const messageModel = db.messages;
const getDiscussionsByUser = (user) => {

}


const addMessage = async (message_from, message_to, message_content) => {
    const date = new Date();
    console.log(message_content)
    const message = await messageModel.create({
        message_from,
        message_to,
        message_content,
        date,
        read: false,
    })
    return message;

}
module.exports = {
    addMessage,
    getDiscussionsByUser,
}
