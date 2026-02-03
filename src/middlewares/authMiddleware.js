import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { utils } from "../utils/index.js";

export const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
         res.status(401).json({
            errors : 'Unauthorized'
        })
    }

    if(!authorization.startsWith('Bearer ')) {
        throw new UnauthorizedError();
    }

    const token = authorization.split(' ')[1];

    try {
        const jwtDecode = utils.jwt.verifyToken(token);
        req.user = jwtDecode;
        next()
    } catch (error) {
        res.status(401).json({
            errors : 'Unauthorized'
        })
    }
}