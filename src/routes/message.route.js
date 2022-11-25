const Router = require('express')
const router = Router();
const msgController = require('../controllers/message.controller.js');
const {isAuthenticated} = require('../middleware/authentication');

router.route('/')
    .post(isAuthenticated,msgController.addMessage)
    .get(isAuthenticated, msgController.getAllDiscussions);

// router.route('/:id')
//     .get(msgController.findOne);
//
// router.route('/:id')
//     .delete(msgController.delete);
//
// router.route('/:id')
//     .put(msgController.update);

module.exports = router;
