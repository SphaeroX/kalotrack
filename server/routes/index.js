const dotenv = require("dotenv");
dotenv.config();

const OpenAI = require("openai");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const Prompts = require("../utils/prompts");

const prompts = new Prompts();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function prompt(req, res) {
  const userInput = req.body.prompt;

  const prompt = prompts.textToObject(userInput);

  console.log("Prompting with userinput: " + userInput);
  const answer = await askChatGPT(prompt, false, 0.2);

  try {
    const parsedAnswer = JSON.parse(answer);
    res.status(200).json(parsedAnswer);
  } catch (error) {
    console.error("Fehler beim Parsen des Antwortobjekts:", error);
    res.status(500).send("Fehler bei der Abfrage von OpenAI");
  }
}

// Funktion zum Codieren des Bildes in base64
async function imageToItems(req, res) {
  try {
    const openai = new OpenAI();

    const imageBytes = req.file.buffer;
    const base64Image = encodeImage(imageBytes);

    // Funktion zum Erkennen des Bildtyps
    const getImageType = (buffer) => {
      const signature = buffer.toString('hex', 0, 4); // Erste 4 Bytes als Hex
      if (signature.startsWith('ffd8')) return 'jpeg'; // JPEG
      if (signature.startsWith('8950')) return 'png';  // PNG
      if (signature.startsWith('4749')) return 'gif';  // GIF
      return null;
    };

    const imageType = getImageType(imageBytes);
    if (!imageType) {
      res.status(400).json({ error: 'Unsupported image type' });
      return;
    }

    const mimeType = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif'
    }[imageType];

    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: global.chatGptModel,
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "Gebe mir in einem kurzen Satz wieder was für ein Essen du auf dem Bild siehst und wieviel, zB ein Teller voll mit Salat oder ein großes Stück Pizza Funghi. Halte dich so kurz wie möglich"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "image_url",
              "image_url": {
                "url": imageUrl
              }
            }
          ]
        }
      ],
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        "type": "text"
      },
    });

    const answer = response.choices[0].message.content;

    console.log("OPENAI IMAGE: " + answer);
    req.body.prompt = answer;
    prompt(req, res);
  } catch (error) {
    console.error("Fehler bei der Anfrage an die OpenAI-API:", error);
    res.status(500).json({ error: "Fehler bei der Anfrage an die OpenAI-API" });
  }
}

function encodeImage(buffer) {
  return buffer.toString('base64');
}

async function ask(req, res) {
  try {
    if (!req.file.buffer) {
      return res.status(400).json({ error: "Keine Datei empfangen." });
    }

    const jsonPayload = JSON.parse(req.body.jsonPayload);

    const transcription = await speechToText(req.file.buffer);

    const prompt = prompts.askKaloTrack(transcription, jsonPayload);

    const answer = await askChatGPT(prompt, false, 0.2);

    res.status(200).json({ answer: answer });
  } catch (error) {
    console.error("Fehler beim Parsen des Antwortobjekts:", error);
    res.status(500).send("Fehler bei der Abfrage von OpenAI");
  }
}

async function transcribe(req, res) {
  try {
    if (!req.file.buffer) {
      return res.status(400).json({ error: "Keine Datei empfangen." });
    }

    const transcription = await speechToText(req.file.buffer);

    const prompt = prompts.textToObject(transcription);

    console.log("Prompting with transcribed: " + transcription);

    const answer = await askChatGPT(prompt, false, 0.2);

    const parsedAnswer = JSON.parse(answer);
    res.status(200).json({ items: parsedAnswer });
  } catch (error) {
    console.error("Fehler beim Parsen des Antwortobjekts:", error);
    res.status(500).send("Fehler bei der Abfrage von OpenAI");
  }
}

async function speechToText(audioBuffer) {
  try {
    const formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("language", "de");

    const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });

    formData.append("file", audioBlob, "audio.mp3");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${global.openaiApiKey}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    console.log("Whisper: " + data.text);

    return data.text;
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Datei:", error);
    return false;
  }
}

async function askChatGPT(prompt, role = false, temperature = 1) {
  const openai = new OpenAI();
  const requestBody = {
    model: global.chatGptModel,
    response_format: { "type": "json_object" },
    messages: [
      {
        role: "user",
        content: compressText(prompt),
      },
    ],
    temperature,
  };

  if (role) {
    requestBody.messages.push(role);
  }

  try {
    const responseData = await openai.chat.completions.create(requestBody);

    if (responseData.choices[0].message.content) {
      console.log("OpenAi: " + responseData.choices[0].message.content);
      return responseData.choices[0]?.message?.content
        ? responseData.choices[0].message.content
        : false;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);

    return false;
  }

  function compressText(text) {
    // Entferne Zeilenumbrüche und ersetze sie durch Leerzeichen
    text = text.replace(/\n/g, " ");

    // Entferne mehrere aufeinanderfolgende Leerzeichen
    text = text.replace(/\s+/g, " ");

    return text;
  }
}

async function createPlan(req, res) {
  let type = null;
  let gym = null;
  if (req.body.type === "Zuhause") {
    type = "Freeletics";
    gym =
      "Schaue bei den Gym Übungen darauf das man keine extra geräte braucht und nur mit dem körper trainiert.";
  } else {
    type = "gym";
    gym = `
    Schaue bei den Gym Übungen darauf das in einem Plan nur eine spezifische Gruppe trainiert wird.
    Zulässige Gruppen sind: 
    Trizeps und Brust, Bizeps und rücken, Bauch und Beine, Schulter vorne und hinten, Beine vorne und hinten.
    `;
  }

  let additional = null;
  if (req.body.additional) {
    additional = `hier noch eine Infos von mir:"${req.body.additional}", falls sie keinen Sinn ergibt ignoriere sie`;
  } else {
    additional = "";
  }

  let exercisesAmount = null;
  if (parseInt(req.body.exercisesAmount)) {
    exercisesAmount = `und ${req.body.exercisesAmount} Übungen haben.`;
  } else {
    exercisesAmount = ".";
  }

  const prompt = prompts.createTrainingPlain(
    req.body.amount,
    req.body.weight,
    req.body.gender,
    req.body.level,
    type,
    req.body.focus,
    req.body.duration,
    exercisesAmount,
    additional,
    gym,
  );

  console.log(prompt);

  const answer = await askChatGPT(prompt, false, 0.2);
  try {
    res.status(200).json(answer);
  } catch (error) {
    console.error("Fehler beim Parsen des Antwortobjekts:", error);
    res.status(500).send("Fehler bei der Abfrage von OpenAI");
  }
}

router.post("/prompt", upload.single("audio"), prompt);
router.post("/imageToItems", upload.single("image"), imageToItems);
router.post("/transcribe", upload.single("audio"), transcribe);
router.post("/speech/ask", upload.single("audio"), ask);
router.post("/plans/create", upload.single("audio"), createPlan);

module.exports = router;
