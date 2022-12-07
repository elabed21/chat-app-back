const Router = require('express')
const router = Router();
const contactController = require('../controllers/contact.controller.js');

router.route('/')
    .post(contactController.create);

router.route('/')
    .get(contactController.findAll);

router.route('/:id')
    .get(contactController.findOne);

router.route('/:id')
    .delete(contactController.delete);

router.route('/:id')
    .put(contactController.update);

module.exports =  router;