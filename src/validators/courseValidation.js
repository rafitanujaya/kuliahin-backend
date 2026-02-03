import Joi from "joi"

const createCourseSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    sks: Joi.number().min(1).max(24).required(),
    type: Joi.string().valid('teori', 'praktek', 'seminar'),
    lecturer: Joi.string().min(2).max(255).required()
}).required()

const updateCourseSchema = Joi.object({
    courseId: Joi.string().required(),
    name: Joi.string().min(2).max(255).required(),
    sks: Joi.number().min(1).max(24).required(),
    type: Joi.string().valid('teori', 'praktek', 'seminar'),
    lecturer: Joi.string().min(2).max(255).required()
}).required()

export {
    createCourseSchema,
    updateCourseSchema
}