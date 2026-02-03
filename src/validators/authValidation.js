import Joi from "joi"

const registerSchema = Joi.object({
    fullname: Joi.string().min(4).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(32).required()
}).required();

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(32).required()
}).required()

export {
    registerSchema,
    loginSchema
}