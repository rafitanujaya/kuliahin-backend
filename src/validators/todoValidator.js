import Joi from "joi"

const createTaskSchema = Joi.object({
    title: Joi.string().min(4).max(255).required(),
    category: Joi.string().valid('personal', 'belajar', 'organisasi', 'lainnya').required(),
    status: Joi.string().valid('todo', 'done').required()
}).required()

const updateTaskSchema = Joi.object({
    title: Joi.string().min(4).max(255).required(),
    category: Joi.string().valid('personal', 'belajar', 'organisasi', 'lainnya').required(),
    status: Joi.string().valid('todo', 'done').required()
}).required()

export {
    createTaskSchema,
    updateTaskSchema
}