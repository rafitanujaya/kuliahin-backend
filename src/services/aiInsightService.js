import { gemini } from "../config/gemini.js";
import { pool } from "../database/postgre/pool.js"
import { NotFoundError } from "../errors/notFoundError.js";
import { learningInsightPrompt } from "../prompts/learningPrompt.js";
import { createAiInsightLearningRepository, getLearningByIdRepository, getLearningInsightByIdRepository, getListLearningContentRepository } from "../repositories/learningRepository.js";
import { downloadFileAsBase64 } from "../utils/downloadFile.js";
import { v4 as uuid } from "uuid";

const safeParseMarkdown = (text) => {
  if (!text.startsWith('## Overview')) {
    throw new Error('Format AI tidak valid');
  }
  return text.trim();
};

export const generateLearningInsightDirectService = async (learningId, userId) => {
    const dbClient = await pool.connect();
    try {
        await dbClient.query('BEGIN')

        const learningSpace = await getLearningByIdRepository(learningId, userId, dbClient);

        if (!learningSpace){
            throw new NotFoundError('Learning Room tidak ditemukan')
        }

        const contents = await getListLearningContentRepository(learningId, dbClient);

        if (contents.length === 0) {
            throw new Error('Tidak ada learning content');
        }
        const parts = [];

        for (const content of contents) {
            if(!content.file_url) continue;

            const base64 = await downloadFileAsBase64(content.file_url);


            parts.push({
                inlineData: {
                    mimeType: content.mime_type,
                    data: base64
                }
            })
        }

        parts.push(learningInsightPrompt)

         const model = gemini.getGenerativeModel({
            model: 'gemini-2.5-flash'
         });


        const result = await model.generateContent(parts)
        const text = result.response.text();


        const aiResult = safeParseMarkdown(text);

        const insightLearning = {
            id: uuid(),
            learningId: learningId,
            content: aiResult
        }

        await createAiInsightLearningRepository(insightLearning, dbClient)

        await dbClient.query('COMMIT')

        return insightLearning
    } catch (error) {
        await dbClient.query('ROLLBACK')
        throw error
    } finally {
        dbClient.release()
    }
}

export const getLearningInsightById = async (id) => {
    const insight = await getLearningInsightByIdRepository(id, pool);
    if(!insight) {
        throw new NotFoundError('insight tidak ditemukan')
    }
    return insight
}