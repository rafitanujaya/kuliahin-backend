import { AppError } from "./appError.js";

class ConflictError extends AppError {
    constructor (message = 'conflict') {
        super(message, 409, "CONFLICT ERROR")
    }
}

export {
    ConflictError
}