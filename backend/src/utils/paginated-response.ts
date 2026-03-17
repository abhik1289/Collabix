import { ApiResponse } from "./api-response"



export class PaginatedResponse<T> extends ApiResponse<T> {
   

    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }

    constructor({ success, data, message, status, pagination }:
         { success: boolean, data?: T, 
            message: string,
             status: number,
              pagination:
               { page: number, limit: number, total: number, totalPages: number }
         }) {
        super({ success, data, message, status })
        this.pagination = {
            ...pagination,
            totalPages:Math.ceil(pagination.total/pagination.limit)
        }
    }


}