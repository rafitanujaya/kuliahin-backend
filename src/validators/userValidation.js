import Joi from "joi";

export const updateProfileSchema = Joi.object({
    fullname: Joi.string().min(4).max(255).required(),
    major: Joi.string().required(),
    semester: Joi.number().min(1).required()
}).required()

export const updatePasswordSchema = Joi.object({
    passwordCurrent: Joi.string().min(6).max(32).required(),
    passwordNew: Joi.string().min(6).max(32).required()
}).required()
