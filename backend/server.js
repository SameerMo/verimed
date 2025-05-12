import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors({
  origin: 'https://verimed.netlify.app'
}));
app.use(express.json());
dotenv.config();
const port = process.env.PORT;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    
    res.json({
      success: true,
      text: response.text()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const recordSchema = new mongoose.Schema({
    data: String,
    isPublic: Boolean,
    patientAddress: String,
  });
  
  const Record = mongoose.model('Record', recordSchema);
  
  app.post('/upload', async (req, res) => {
    const { data, isPublic, patientAddress } = req.body;
    const newRecord = new Record({ data, isPublic, patientAddress });
    await newRecord.save();
    res.json({ success: true, record: newRecord });
  });
  
  app.get('/records', async (req, res) => {
    const records = await Record.find({ isPublic: true });
    res.json(records);
  });  
  
mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(5000))
    .catch(console.error);
