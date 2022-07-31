import cors from 'cors';
import express from 'express';

const PORT: number = 4000;
const app = express();

app.use(cors());

app.get('/test', (req, res) => {
  console.log('hello');
  res.send('hello');
});

export default app;
