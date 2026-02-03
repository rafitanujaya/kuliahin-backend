import { config } from "../config/index.js"
import { pool } from "../database/postgre/pool.js"
import { NotFoundError } from "../errors/notFoundError.js"
import { ValidationError } from "../errors/validationError.js"
import { getDetailUserByIdRepository, getUserByIdRepository, getUserProfileByIdRepository, updateUserPasswordRepository, updateUserProfileRepository, upsertUserPreferenceRepository } from "../repositories/userRepository.js"
import bcrypt from 'bcrypt'
import { validate } from "../validators/validation.js"
import { utils } from "../utils/index.js"

export const getProfileUserByIdService = async (id) => {
    const user = await getUserProfileByIdRepository(id, pool)
    if(!user) {
        throw new NotFoundError('User tidak ditemukan')
    }
    return user
}

export const getDetailUserByIdService = async (id) => {
    const user = await getDetailUserByIdRepository(id, pool);
    if(!user) {
        throw new NotFoundError('User tidak ditemukan')
    }
    return user
}

export const updateUserProfileService = async (userId, payload) => {
    const validatePayload = validate.user.updateProfile(payload)

    const data = {
        ...validatePayload
    }

    data.avatarInitial = utils.generateInitials(payload.fullname);

    await updateUserProfileRepository(userId, data, pool)
    return data
}

export const updateUserPasswordService = async (userId, payload) => {
    const validatePayload = validate.user.updatePassword(payload)
    const user = await getUserByIdRepository(userId, pool)

    const isValid = await bcrypt.compare(validatePayload.passwordCurrent, user.password)
    if (!isValid) throw new ValidationError('Password Salah')

    const hashed = await bcrypt.hash(validatePayload.passwordNew, config.BCRYPT_SALT);

    await updateUserPasswordRepository(userId, hashed, pool)
}

export const updateUserPreferenceService = async (userId, payload) => {
    const ALLOWED_FIELDS = [
        'notifDeadline',
        'notifSchedule',
        ]
    const cleanedPayload = {}

    for (const key of ALLOWED_FIELDS) {
        if (payload[key] !== undefined) {
        cleanedPayload[key] = payload[key]
        }
    }

    if (Object.keys(cleanedPayload).length === 0) {
        throw new Error('Tidak ada preference yang diubah')
    }

    await upsertUserPreferenceRepository(userId, cleanedPayload, pool)

    return cleanedPayload
}