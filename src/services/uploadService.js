import path from 'path';
import { v4 as uuid } from 'uuid';
import { supabase } from '../config/supabase.js';
import { getVideoDurationFromBuffer } from '../utils/videoDuration.js';

export const uploadToSupabaseService = async (file, learningId) => {
    const ext = path.extname(file.originalname);
    const fileId = uuid();

    const filePath = `${learningId}/${fileId}${ext}`
    
    let duration = null;
    if (
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/quicktime'
    ) {
        const seconds = await getVideoDurationFromBuffer(file.buffer);

        duration = new Date(seconds * 1000)
        .toISOString()
        .substring(11, 19);
    }

    const {error} = await supabase.storage.from('learning-contents')
    .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
    })

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
    .from('learning-contents')
    .getPublicUrl(filePath);

    return {
        path: filePath,
        publicUrl: data.publicUrl,
        size: file.size,
        mimeType: file.mimetype,
        duration
    };


}

export const deleteFromSupabaseService = async (filePath) => {
    const {error} = await supabase.storage.from('learning-contents').remove(filePath)

    if(error) {
        console.error('Failed to delete file from Supabase:', error);
        throw new Error('Failed to delete file from Supabase')
    }
}