import Joi from "joi"

const createTaskSchema = Joi.object({
    courseId: Joi.string().required(),
    title: Joi.string().min(4).max(255).required(),
    description: Joi.string().max(300).required(),
    deadline: Joi.date().iso().required(),
    type: Joi.string().valid('individu', 'kelompok').required(),
    status: Joi.string().valid('todo', 'done').required(),
    priority: Joi.string().valid('low', 'medium', 'high').required()
}).required()

const updateTaskSchema = Joi.object({
    courseId: Joi.string().required(),
    title: Joi.string().min(4).max(255).required(),
    description: Joi.string().max(300).required(),
    deadline: Joi.date().iso().required(),
    type: Joi.string().valid('individu', 'kelompok').required(),
    status: Joi.string().valid('todo', 'done').required(),
    priority: Joi.string().valid('low', 'medium', 'high').required()
}).required()

export {
    createTaskSchema,
    updateTaskSchema
}