const express = require('express');
const router = express.Router();

const instancePrint = require('./print.route');
const miscRoutes = require('./misc.route');

router.use('/print', instancePrint);
router.use('/misc', miscRoutes);

module.exports = router;
