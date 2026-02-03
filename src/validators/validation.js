import { ValidationError } from "../errors/validationError.js";
import * as auth from './authValidation.js'
import * as course from './courseValidation.js'
import * as schedule from './scheduleValidation.js'
import * as task from './taskValidation.js'
import * as todo from './todoValidator.js'
import * as learning from './learningValidation.js'
import * as user from './userValidation.js'


const validateSchema = (schema, payload) => {
    const result = schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true
    });

    if(result.error) {
        throw new ValidationError(result.error);
    } else {
        return result.value
    }
}

const validate = {
    auth: {
        login : (payload) => validateSchema(auth.loginSchema, payload),
        register : (payload) => validateSchema(auth.registerSchema, payload)
    },
    course: {
        create: (payload) => validateSchema(course.createCourseSchema, payload),
        update: (payload) => validateSchema(course.updateCourseSchema, payload)
    },
    schedule: {
        create: (payload) => validateSchema(schedule.createScheduleSchema, payload),
        update: (payload) => validateSchema(schedule.updateScheduleSchema, payload)
    },
    task: {
        create: (payload) => validateSchema(task.createTaskSchema, payload),
        update: (payload) => validateSchema(task.updateTaskSchema, payload)
    },
    todo: {
        create: (payload) => validateSchema(todo.createTaskSchema, payload),
        update: (payload) => validateSchema(todo.updateTaskSchema, payload)
    },
    learning: {
        create: (payload) => validateSchema(learning.createLearningSchema, payload),
        update: (payload) => validateSchema(learning.updateLearningSchema, payload),
    },
    user: {
        updateProfile: (payload) => validateSchema(user.updateProfileSchema, payload),
        updatePassword: (payload) => validateSchema(user.updatePasswordSchema, payload)
    }
}

export {
    validate
}