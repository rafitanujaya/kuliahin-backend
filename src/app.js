import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { router } from './routes/index.js';

const createApp = () => {
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(morgan('dev'));
    app.use(cors());

    // Routes
    app.use('/api', router)

    // Error Handling
    app.use(errorMiddleware)


    return app
}

export {
    createApp
}