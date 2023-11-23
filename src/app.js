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
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// init db
require("./dbs/init.mongodb")
const { checkOverload } = require("./helpers/check.connect")
checkOverload()

// init routes
app.use('/', require('./routes/index'))

// handle error

module.exports = app