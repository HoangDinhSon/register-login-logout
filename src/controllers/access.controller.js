'use strict'

const AccessService = require("../services/access.service");
const {CREATED, OK,SuccessResponse} = require ('../core/success.response')

class AccessController {
    handleRefreshToken =async (req, res, next)=>{
        new SuccessResponse ({
            message :'Get Token Success',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res)
    }
    logout =async (req, res, next)=>{
        new SuccessResponse ({
            message :'Logout Success ',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    login =async (req, res, next)=>{
        new SuccessResponse ({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED ({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}
module.exports = new AccessController()