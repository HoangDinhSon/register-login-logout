const express = require("express")
const morgan = require('morgan')
const helmet = require('helmet');
const compression = require("compression");
const app = express();
// init middleware
app.use(morgan("dev"))// when dev 
// app.use(morgan("combined"))// when product
// app.use(morgan("common"))
// app.use(morgan("short"))
// app.use(morgan("tiny"))
app.use(helmet())
// app.use(compression()) 
// init db
require("./dbs/init.mongodb")
const {checkOverload}= require("./helpers/check.connect")
checkOverload()

// init routes
app.get("/", (req, res, next) => {
    const strCompress = "Hello me"
    return res.status(200).json({
        message: " Welcome Fantipsjs",
        metadata: strCompress.repeat(100000)
    })
})


// handle error

module.exports = app