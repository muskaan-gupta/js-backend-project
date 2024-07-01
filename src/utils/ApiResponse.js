class ApiResponse{
    constructor(statuscCode,data, message ="Success")
    {
        this.statusCode =statusCode
        this.data= data
        this.success= statuscCode <400   // this is api response it should not be a apierror
        this.message=message

    }
}

export{ApiResponse}