import { pool } from "../database/postgre/pool.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { createLearningContentRepository, createLearningRepository, deleteLearningContentByIdRepository, deleteLearningRepository, getDetailLearningContentRepository, getLearningByIdRepository, getListLearningContentRepository, getListLearningRepository, updateLearningRepository } from "../repositories/learningRepository.js";
import { validate } from "../validators/validation.js"
import { v4 as uuid } from "uuid";
import { deleteFromSupabaseService, uploadToSupabaseService } from "./uploadService.js";
import path from 'path'

export const createLearningService = async (payload, userId) => {
    const learningValidate = validate.learning.create(payload);

    const learning = {
        id: uuid(),
        ...learningValidate
    }

    await createLearningRepository(learning, userId, pool)
    return learning
}

export const getLearningByIdService = async (id, userId) => {
    const learning = await getLearningByIdRepository(id, userId, pool);
    if(!learning) {
        throw new NotFoundError('Learning Room tidak ditemukan')
    }
    return learning
}

export const getListLearningService = async (userId) => {
    const learnings = await getListLearningRepository(userId, pool);
    return learnings
}

export const updateLearningService = async (payload, id, userId) => {
    const learningValidate = validate.learning.update(payload);

    let learning = await getLearningByIdRepository(id, userId, pool);

    if(!learning) {
        throw new NotFoundError('Learning Room Tidak Ditemukan')
    }

    learning = {
        id,
        ...learningValidate
    }

    await updateLearningRepository(learning, userId, pool)
}

export const deleteLearningService = async (id, userId) => {

    const dbClient = await pool.connect()

    try {
        await dbClient.query('BEGIN')

        const learning = await getLearningByIdRepository(id, userId, dbClient);

        if(!learning) {
            throw new NotFoundError('Learning Room tidak ditemukan')
        }


        const contents = await getListLearningContentRepository(id, dbClient);
        
        const paths = [];
        if (contents.length >= 1) {
            for (const content of contents) {
                if(!content.file_path) continue;
                paths.push(content.file_path)
            }
        }
        
        if(path >= 1) {
            await deleteFromSupabaseService(paths)
        }

        await deleteLearningRepository(id, userId, dbClient)

        await dbClient.query('COMMIT')
    } catch (error) {
        await dbClient.query('ROLLBACK')
    } finally {
        dbClient.release()
    }

}

export const createLearningContentService = async (id, userId, file) => {
    const dbClient = await pool.connect();
    let uploadFile = null;

    try {
        await dbClient.query('BEGIN')

        const learningSpace = await getLearningByIdRepository(id, userId, dbClient)
        if(!learningSpace) {
            throw new NotFoundError('Learning Space Tidak ditemukan')
        }

        // upload kedatabase

        uploadFile = await uploadToSupabaseService(file, id)

        const typeMap = {
            'application/pdf': 'pdf',
            'video/mp4': 'mp4',
            'video/quicktime': 'mp4',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docs'
        };

        const content = {
            id: uuid(),
            learningSpaceId: id,
            title: file.originalname,
            type: typeMap[file.mimetype],
            duration: uploadFile.duration ?? null,
            fileSize: uploadFile.size,
            filePath: uploadFile.path,
            fileUrl : uploadFile.publicUrl,
            mimeType: uploadFile.mimeType
        }

        await createLearningContentRepository(content, dbClient)

        await dbClient.query('COMMIT')
        return content
    } catch (error) {
        await dbClient.query('ROLLBACK')
        if (uploadFile) {
            await deleteFromSupabaseService([uploadFile.path]);
        }
        throw error
    } finally {
        dbClient.release()
    }
}

export const deleteLearningContentService = async (learningId, contentId) => {
     const dbClient = await pool.connect()

    try {
        await dbClient.query('BEGIN')

        const learning = await getDetailLearningContentRepository(learningId, contentId, dbClient);
        if(!learning) {
            throw new NotFoundError('Learning Content tidak ditemukan')
        }
        
        const paths = learning.file_path ? [learning.file_path] : [];
        if (paths.length > 0) {
            await deleteFromSupabaseService(paths)
        }

        await deleteLearningContentByIdRepository(learningId, contentId, dbClient)

        await dbClient.query('COMMIT')
    } catch (error) {
        await dbClient.query('ROLLBACK')
    } finally {
        dbClient.release()
    }
}

export const getListLearningContentService = async (learningSpaceId) => {
    const learningContents = await getListLearningContentRepository(learningSpaceId, pool)
    return learningContents
}
