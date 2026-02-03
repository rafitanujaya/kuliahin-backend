import fetch from 'node-fetch';

export const downloadFileAsBase64 = async (url) => {
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error('Failed to download file');
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64')
}