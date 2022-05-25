const express = require('express')
const controller = require('../controllers/misc.controller')
const authVerify = require('../middlewares/authCheck')

const router = express.Router()
router.route('/check-server').get(controller.checkServer)

module.exports = router
