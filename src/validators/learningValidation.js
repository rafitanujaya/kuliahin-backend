import Joi from "joi";

export const createLearningSchema = Joi.object({
    title: Joi.string().min(4).max(255).required(),
    description: Joi.string().max(255),
}).required()

export const updateLearningSchema = Joi.object({
    title: Joi.string().min(4).max(255).required(),
    description: Joi.string().max(255),
}).required()