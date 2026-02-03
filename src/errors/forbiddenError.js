import { AppError } from "./appError";

class ForbiddenError extends AppError {
    constructor (message = 'forbidden') {
        super(message, 403, "FORBIDDEN ERROR")
    }
}

export {
    ForbiddenError
}