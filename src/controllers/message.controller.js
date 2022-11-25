const db = require("../models");
const Messages = db.messages;
const messageService = require("../services/messages.service")

exports.getAllDiscussions = async (req, res, next) => {
    try {
        const {
            user
        } = req;

        const result = await messageService.getDiscussionsByUser(user);
        return res.send(result);
    } catch (e) {
        console.error(e)
    }
}

exports.addMessage = async (req, res, next) => {
    try {
        const { user } = req;
        const message_from = user.email;
        const {
            message_to,
            message_content,
        } = req.body;

        const result = await messageService.addMessage(message_from, message_to, message_content);
        return res.status(201).send(result);
    } catch (e) {
        console.error(e)
    }
}
