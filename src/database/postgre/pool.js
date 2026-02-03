import { Pool } from "pg";
import { config } from "../../config/index.js";

const pool = new Pool({
    max: 10,
    host: config.DB.HOST,
    port: config.DB.PORT,
    user: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.DATABASE,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

export {
    pool
};