'use strict'
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require('../utils/index')
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}
class AccessService {
    /*
     handle refresh token when leak
    */
    static handleRefreshToken = async (refreshToken) => {
        //1. check  find token that has been used in array in database 
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // if we find out token prove token was leaked and delete 
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })
            // delete token by id 
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happen please re login')
        }
        //2. after check refresh token has been used or not after check this refresh token in useing 
        // check token similar in refresh token in database 
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) {
            throw new AuthFailureError('Shop not register 1')
        }
        // verify refresh Token 
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        // check userId has exist in DB 
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError(' Shop not register  2')
        // create new pair token and refreshToken , if doubt must make new token and refresh token. 
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // update tokens 
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // used to get new refresh token 
            }
        })
        return { user: { userId, email }, tokens }
    }
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }
    /*
        1- check email in dbs
        2- match password
        3- create private key and publickey
        4- generate tokens 
        5- get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError('Shop not registered')
        }
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError(' authentication error')
        }
        //3 .
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4. 
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId: foundShop._id
        })
        //5.
        return {
            shop: getInfoData({ object: foundShop, fields: ['_id', 'name', 'email'] }),
            tokens
        }

    }
    static signUp = async ({ name, email, password }) => {

        // check email exist
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError("Error Shop already register")
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })
        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            console.log({ privateKey, publicKey });
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                // throw new BadRequestError("Error Shop already register")
                return {
                    code: "xxxx",
                    message: "keyStore error"
                }
            }
            // created token 
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`created token success`, tokens)
            return {
                code: 201,
                metadata: { tokens, shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }) }
            }
        }
        return {
            code: 200,
            metadata: null
        }

    }
}
// why don't have use new because we use static in class
module.exports = AccessService