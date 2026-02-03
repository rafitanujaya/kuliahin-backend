import { AppError } from "./appError.js";

class NotFoundError extends AppError {
    constructor (message = 'NotFound') {
        super(message, 404, "NOTFOUND ERROR")
    }
}

export {
    NotFoundError
}