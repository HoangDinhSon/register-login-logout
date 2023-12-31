'use strict'
const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect')
const config = require('../configs/config.mongdb')
const {db:{host,port , name}}= config
const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }
    // connect
    connect(type = 'mongodb') {

        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50,
        }).then(() => {
            console.log(`Connected MongoDb Success`);
            countConnect()
        }).catch((error) => {
            console.log(`Error Connect`);
        })
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance
    }
}
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb