import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

ffmpeg.setFfmpegPath(ffmpegPath);

export const getVideoDurationFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const tempFile = path.join(
      os.tmpdir(),
      crypto.randomUUID() + '.mp4'
    );

    fs.writeFileSync(tempFile, buffer);

    ffmpeg.ffprobe(tempFile, (err, metadata) => {
      fs.unlinkSync(tempFile);

      if (err) {
        return reject(err);
      }

      resolve(metadata.format.duration); // dalam detik (float)
    });
  });
};
