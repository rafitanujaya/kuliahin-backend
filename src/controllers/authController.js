import { google } from "googleapis";
import { authorizationUrl, oauth2Client } from "../config/google.js";
import { config } from "../config/index.js";
import { loginGoogleService, loginService, registerService } from "../services/authService.js";
import { ConflictError } from "../errors/conflictError.js";

export const registerController = async (req, res, next) => {
    try {
        const payload = req.body;
        await registerService(payload);

        res.status(201).json({
            message: 'Register Success',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const loginController = async (req, res, next) => {
    try {
        const payload = req.body;
        const token = await loginService(payload);

        res.json({
            message: 'Login Success',
            data: {
                token
            }
        })
    } catch (error) {
        next(error)
    }
}

export const verifyController = async (req, res, next) => {
    try {
        res.json({
            message: 'Verify success',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const loginGoogle = async (req, res, next) => {
    try {
        res.redirect(authorizationUrl)
    } catch (error) {
        next(error)
    }
}

export const loginGoogleCb = async (req, res, next) => {
    try {
        const {code} = req.query
        const {tokens} = await oauth2Client.getToken(code)

        oauth2Client.setCredentials(tokens)

        const oauth2 = google.oauth2({
            version: 'v2',
            auth: oauth2Client
        })

        const data = await oauth2.userinfo.get();

        if(!data) {
            throw new ResponseError(500, 'kesalahan server hehe')
        }

        const tokenJwt = await loginGoogleService(data.data);

        res.redirect(`${config.FRONTEND_URL}/login/google?token=${tokenJwt}`)
    } catch (error) {
        if(error instanceof ConflictError) {
            res.redirect(`${config.FRONTEND_URL}/login?error=email`)
        }
        next(error)
    }
}