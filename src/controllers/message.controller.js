const db = require("../models");
const Messages = db.messages;
const messageService = require("../services/messages.service");

exports.getAllDiscussions = async (req, res, next) => {
  try {
    const { user } = req;

    const result = await messageService.getDiscussionsByUser(user);
    return res.send({
      count: result.count,
      rows: result.rows,
    });
  } catch (e) {
    console.error(e);
  }
};

exports.getDiscussionDetails = async (req, res, next) => {
  try {
    const { user } = req;

    const { id } = req.params;
    console.log("id", req);
    const result = await messageService.getDiscussionByParentId(id);
    return res.send({
      count: result.count,
      rows: result.rows,
    });
  } catch (e) {
    console.error(e);
  }
};

exports.setReadMessageTo = async (req, res, next) => {
  try {
    const { read } = req.body;
    const { id } = req.params;

    const result = await messageService.patchReadMessage(id, read);
    return res.send(true);
  } catch (e) {
    console.error(e);
  }
};

exports.addMessage = async (req, res, next) => {
  try {
    const { user } = req;
    const message_from = user.email;
    const { message_parent, discussion, message_to, message_content } =
      req.body;

    const result = await messageService.addMessage(
      message_from,
      message_to,
      message_content,
      discussion,
      message_parent
    );
    return res.status(201).send(result);
  } catch (e) {
    console.error(e);
  }
};
