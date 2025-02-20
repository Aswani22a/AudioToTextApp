const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const cors = require('cors');
const app = express();
const upload = multer();

// Enable CORS
app.use(cors());

// Google Cloud Setup
const speechClient = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'service-account-key.json'
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    const audioBytes = req.file.buffer.toString('base64');
    
    const [response] = await speechClient.recognize({
      audio: { content: audioBytes },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: req.body.language,
        enableAutomaticPunctuation: true
      }
    });

    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.json({ text: transcription });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
