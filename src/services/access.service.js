'use strict'
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require('../utils/index')
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}
class AccessService {
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
            refreshToken :tokens.refreshToken,
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