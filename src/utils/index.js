import { generateInitials } from "./name.js";
import * as jwt from './jwt.js'
import { getVideoDurationFromBuffer } from "./videoDuration.js";

const utils = {
    generateInitials,
    jwt,
    getVideoDurationFromBuffer
}

export {
    utils,
}