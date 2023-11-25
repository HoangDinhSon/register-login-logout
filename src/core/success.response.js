'use strict'
const StatusCode = {
    OK: 200,
    CREATED: 201
}
const ReasonsStatusCode = {

    CREATED: 'created',
    OK: 'Success'
}
class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatuscode = ReasonsStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatuscode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}
class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatuscode = ReasonsStatusCode.CREATED, metadata }) {
        super({ message, metadata ,statusCode, reasonStatuscode})
    }
}
module.exports=  {OK, CREATED}