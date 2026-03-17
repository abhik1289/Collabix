import { ApiResponse } from "./api-response";



export class ApiSuccess<T> extends ApiResponse<T> {

    constructor(data: T, message?: string, status?: number) {
        super({ success: true, data,message, status: status })
    }

}