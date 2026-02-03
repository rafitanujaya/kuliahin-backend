import { AppError } from "./appError";

class ServerError extends AppError {
    constructor (message = 'Server') {
        super(message, 403, "SERVER ERROR")
    }
}

export {
    ServerError
}