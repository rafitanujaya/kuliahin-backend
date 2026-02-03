import { AppError } from "../errors/appError.js"

export const errorMiddleware = async (err, req, res, next) => {
    console.log(err);
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