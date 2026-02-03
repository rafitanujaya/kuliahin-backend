import { AppError } from "./appError.js";

class UnauthorizedError extends AppError {
    constructor (message = 'Unauthorized') {
        super(message, 409, "AUTH ERROR")
    }
}

export {
    UnauthorizedError
}