const { Op } = require("sequelize");
const db = require("../models/index");
const messageModel = db.messages;

const getDiscussionsByUser = async (user) => {
  try {
    const conversations = await db.messages.findAndCountAll({
      where: {
        discussion: true,
      },
      include: [{ model: db.messages, as: "parent" }],
    });
    return conversations;
  } catch (error) {
    console.error(error);
  }
};

const getDiscussionByParentId = async (parent_id) => {
  try {
    console.log("parent_id", parent_id);
    const conversations = await db.messages.findAndCountAll({
      where: {
        discussion: true,
        id: parent_id,
      },
      include: [{ model: db.messages, as: "parent" }],
    });
    return conversations;
  } catch (error) {
    console.error(error);
  }
};

const patchReadMessage = async (message_id, read) => {
  try {
    const conversations = await db.messages.update(
      {
        read: read,
      },
      {
        where: {
          id: message_id,
        },
      }
    );
    return conversations;
  } catch (error) {
    console.error(error);
  }
};

const addMessage = async (
  message_from,
  message_to,
  message_content,
  discussion,
  message_parent
) => {
  try {
    const date = new Date();
    const message = await messageModel.create({
      message_from,
      message_to,
      message_content,
      date,
      message_parent,
      discussion,
      read: false,
    });
    return message;
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  addMessage,
  getDiscussionsByUser,
  getDiscussionByParentId,
  patchReadMessage,
};
