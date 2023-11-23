'use strict'
const express = require("express");
const router = express.Router();
router.use('/v1/api', require('./access/index'))
// router.get("/", (req, res, next) => {
//     const strCompress = "Hello me"
//     return res.status(200).json({
//         message: " Welcome Fantipsjs",
//         // metadata: strCompress.repeat(100000)
//     })
// })
module.exports = router