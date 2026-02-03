import { AppError } from "../errors/appError.js"

export const errorMiddleware = async (err, req, res, next) => {
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }

    if(err instanceof AppError) {
        res.status(err.statusCode).json({
            errors: err.message
        })
    } else {
        res.status(500).json({
            error: err.message
        })
    }
}