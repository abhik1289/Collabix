




 export  class ApiResponse<T = any> {
    success: boolean
    data?:T
    message?: string
    status?: number
    constructor({success,data, message="Success", status=200}:{success: boolean, data?: T, message?: string, status?: number}) {
        this.data = data
        this.message = message
        this.status = status
        this.success = success
    }
}