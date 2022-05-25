const express = require('express')
const controller = require('../controllers/print.controller')
const authVerify = require('../middlewares/authCheck')

const router = express.Router()
router.route('/get-printers').get(authVerify, controller.getPrinters)
router.route('/print').post(authVerify, controller.print)

module.exports = router
