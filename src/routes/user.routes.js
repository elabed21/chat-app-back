const Router = require('express')
const router = Router();
const userController = require('../controllers/user.controller.js');

router.route('/signup')
    .post(userController.create);

router.route('/')
    .get(userController.findAll);

router.route('/:id')
    .get(userController.findOne);

router.route('/:id')
    .delete(userController.delete);

router.route('/:id')
    .put(userController.update);

module.exports =  router;
