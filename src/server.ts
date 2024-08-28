import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const port = process.env.PORT || 3000;
const app = express();

if (!genAI) {
  throw new Error("GEMINI_API_KEY não definida");
}

app.use(bodyParser.json({ limit: "20mb" }));

app.post("/upload", async (req, res) => {
  try {
    const  {message}  = req.body;

    const prompt = message;

    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    res.send({message:result.response.text()})

  } catch (error) {
    res.status(500).json({ error: "Erro interno" + error });
  }
});

app.listen(port, () => {
  console.log(`Servidor online em: http://localhost:${port}`);
});
