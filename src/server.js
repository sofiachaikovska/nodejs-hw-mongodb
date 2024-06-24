import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS, UPLOAD_DIR } from './constants/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import rootRouter from './routers/index.js';
import cookiesParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.use(cookiesParser());

  app.use(express.json());

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(rootRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = env(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
