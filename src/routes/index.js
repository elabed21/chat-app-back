const userRoutes = require('./user.routes')
const authRoute = require('./auth.route')
const msgRoute = require('./message.route')
const contactRoute = require('./contact.route')
const express =  require('express')

const router = express.Router();

router.use('/user', userRoutes);
router.use('/auth', authRoute);
router.use('/messages', msgRoute);
router.use('/contact', contactRoute);
module.exports = router;
