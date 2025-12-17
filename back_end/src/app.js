import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/intervilles', routes);
app.use('/uploads', express.static(path.resolve('uploads')));

export default app;