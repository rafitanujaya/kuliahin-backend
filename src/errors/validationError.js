import { AppError } from "./appError.js";

class ValidationError extends AppError {
    constructor (message = 'validation') {
        super(message, 400, "VALIDATION ERROR")
    }
}

export {
    ValidationError
}