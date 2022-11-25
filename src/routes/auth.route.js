const Router = require('express')
const authController = require("../controllers/auth.controller.js");
const router = Router();

router.route('/update-forget/:token')
    .put(authController.updatePassword);

router.route('/login')
    .post(authController.login);

router.route('/reset-password-email')
    .post(authController.forgotPassword);

module.exports =  router;
