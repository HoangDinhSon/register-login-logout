'use strict'
const mongoose = require('mongoose')
const _SECOND = 5000
const numberOfConnectEachCore = 5;
const os = require('os');
const process = require('process')
//count
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections: ${numConnection}`);
}
// check overload connect
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //assume  my computer each core max number of connect is 5/second
        const maxConnections = numberOfConnectEachCore * numCores;
        console.log(`Memory usage: ${memoryUsage/1024/1024} MB`)
        console.log(`Active connect: ${numConnection}`)

        if (numConnection > maxConnections ) {
            console.log(`Connect overload detection`);
        }

    }, _SECOND)
}

module.exports = { countConnect , checkOverload}
