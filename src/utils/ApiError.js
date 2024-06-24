const { Error } = require("mongoose");

class ApiError extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors =[],
        stactck=""
    )
    {
        super(message)
        this.statusCode =statusCode
        this.data= null
        this.success= false;
        this.errors= errors

        if(statck )
        {
            this.stack= stactck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }

}
export{ApiError}