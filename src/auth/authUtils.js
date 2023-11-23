'use strict'
const JWT = require('jsonwebtoken')
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            expiresIn: "2 days"
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days"
        })
        // verify token 
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify:: `, err);
            } else {
                // decode 
                console.log(`decode verify::`, decode);
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {

    }
}
module.exports = {
    createTokenPair
}