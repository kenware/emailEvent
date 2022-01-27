import express from "express";
import cors from 'cors';
import Route from './route';

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/v1', Route);

app.use((req, res) => {
  return res.status(200).json({
    error: "Not a valid endpoint",
  });
});

export default app;
