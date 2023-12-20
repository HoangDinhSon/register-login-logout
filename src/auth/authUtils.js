'use strict'
const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { findByUserId } = require('../services/keyToken.service')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
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
const authentication = asyncHandler(async (req, res, next) => {
    /*
     1 - check user_id missing
     2 - get accessToken
     3 - verify Token
     4 - check user in bds
     5 -check key Store with this user ID
     6 - ok all return next()
    */
    //1.
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError('Invalid Request')
    }
    //2.
    const keyStore = await findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError('Not found  KeyStore')
    }
    //3 
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!keyStore) {
        throw new AuthFailureError('Invalid Request')
    }
    try {
        const decodeUser =  JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid UserId')
        }
        req.keyStore= keyStore
        return next()
    } catch (error) {
        throw error
    }
})
const verifyJWT = async (token, keySecrete)=>{
    return await JWT.verify(token, keySecrete)
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}