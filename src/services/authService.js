import { v4 as uuid } from "uuid";
import { ConflictError } from "../errors/conflictError.js";
import { createUserGoogleRepository, createUserRepository, findUserByEmailRepository, getUserByEmailRepository } from "../repositories/userRepository.js";
import { validate } from "../validators/validation.js"
import bcrypt from 'bcrypt'
import { config } from "../config/index.js";
import { pool } from "../database/postgre/pool.js";
import { utils } from "../utils/index.js";
import { NotFoundError } from "../errors/notFoundError.js";

export const registerService = async (payload) => {
    
    const user = validate.auth.register(payload);

    const emailExists = await findUserByEmailRepository(user.email, pool);
    if(emailExists) {
        throw new ConflictError('Email Already Exists')
    }

    user.id = uuid();
    user.avatarInitial = utils.generateInitials(user.fullname);
    user.password = await bcrypt.hash(user.password, config.BCRYPT_SALT);

    await createUserRepository(user, pool)
}

export const loginService = async (payload) => {
    const user = validate.auth.login(payload)

    const currentUser = await getUserByEmailRepository(user.email, pool);
    if(!currentUser) {
        throw new NotFoundError('Email or Password is wrong')
    }
    if(currentUser.auth_provider == 'google') {
        throw new NotFoundError('Email or Password is wrong')
    }

    const passwordValid = await bcrypt.compare(user.password, currentUser.password);
    if(!passwordValid) {
        throw new NotFoundError('Email or Password is wrong')
    }

    const payloadJwt = {
        id: currentUser.id,
        fullname: currentUser.fullname,
        email: currentUser.email
    }

    return utils.jwt.signToken(payloadJwt);
}

export const loginGoogleService = async (payload) => {
    console.log('Payload Bang');

    const user = await getUserByEmailRepository(payload.email, pool)
    if(user && user.auth_provider == 'cridential') {
            throw new ConflictError('email sudah digunakan')
    }


    let dataJwt = {}
    if(!user) {
        const data = {
            id: uuid(),
            avatarInitial: utils.generateInitials(payload.name),
            fullname: payload.name,
            email: payload.email
        }
        await createUserGoogleRepository(data, pool)
        dataJwt = {
           id: data.id,
           fullname: data.fullname,
           email: data.email,
           avatarInitial: data.avatarInitial
       }
    } else {
        dataJwt = {
           id: user.id,
           fullname: user.fullname,
           email: user.email,
           avatarInitial: utils.generateInitials(user.fullname)
       }
    }


    return utils.jwt.signToken(dataJwt);
}