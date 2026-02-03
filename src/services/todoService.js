import { pool } from "../database/postgre/pool.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { createTodoRepository, deleteTodoByIdRepository, getListTodoByIdRepository, getTodoByIdRepository, updateTodoByIdRepository } from "../repositories/todoRepository.js";
import { validate } from "../validators/validation.js"
import { v4 as uuid } from "uuid";

export const createTodoService = async (payload, userId) => {
    const todoValidate = validate.todo.create(payload);

    const todo = {
        ...todoValidate,
        id: uuid()
    }

    await createTodoRepository(todo, userId, pool)

    return todo
}

export const getTodoByIdService = async (id, userId) => {
    const todo = await getTodoByIdRepository(id, userId, pool);
    if (!todo) {
        throw new NotFoundError('Todo tidak ditemukan')
    }

    return todo
}

export const getListTodoService = async (userId) => {
    const todos = await getListTodoByIdRepository(userId, pool);
    return todos;
}

export const updatetodoService = async (id, payload, userId) => {
    const todoValidate = validate.todo.update(payload);

    let todo = await getTodoByIdRepository(id, userId, pool) 
    if (!todo) {
        throw new NotFoundError('Todo tidak ditemukan')
    }

    todo = {
        ...todoValidate,
        id
    }

    await updateTodoByIdRepository(todo, userId, pool)

    return todo
}

export const deletetTodoByIdService = async (id, userId) => {
    const todo = await getTodoByIdRepository(id, userId, pool);
    if(!todo) {
        throw new NotFoundError('Todo tidak ditemukan')
    }
    await deleteTodoByIdRepository(id, userId, pool)
}