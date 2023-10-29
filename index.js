const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const cors = require("cors");

const app = express();

const port = 8080;

app.use(express.json());

app.use(cors());

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

app.post("/text", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await main(text);

    let data = response[0].message.content;

    res.json(response[0].message.content);
    // res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await DebugMain(text);

    let data = response[0].message.content;

    res.json(response[0].message.content);
    // res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/converter", async (req, res) => {
  try {
    const { text, convert } = req.body;

    const response = await quality(text, convert);

    let data = response[0].message.content;

    res.json(response[0].message.content);
    // res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

async function quality(text, convert) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a text Converter. i give you text and language, Please convert the text ${text} in this language ${convert}`,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

async function main(text) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a Text Generator. I give you a keyword and with that keyword, Please give me a paragraph with this keyword ${text}`,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

async function DebugMain(text) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `act as a Text Summarizer. Please Summarize the following text ${text} in less word`,
      },
    ],
    model: "gpt-3.5-turbo", //it will be costly to use
    // model:'GPT-3',
  });

  return chatCompletion.choices;
}

app.get("/", (req, res) => {
  res.send("Welcome to the backend of Text Generator");
});

app.listen(8080, async () => {
  console.log("Running at port 8080");
});
