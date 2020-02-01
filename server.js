const express = require('express')
const speech = require('@google-cloud/speech');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json({limit: '150mb'}));
app.use(express.urlencoded({limit: '150mb'}));

app.get('/', (req, res) => res.send('Hello this is a voice app!'))

app.post('/transform-audio-to-text', async (req, res) => {

  const client = new speech.SpeechClient();
  const audioBytes = req.body.base64Audio.split(';base64,').pop();

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 'LINEAR16',
    languageCode: 'en-US',
    enableWordConfidence: true,
    enableWordTimeOffsets: true,
    audioChannelCount: 2
  };
  
  const request = {
    audio: audio,
    config: config,
  };


  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
    res.send(response);
    //res.send(`Transcription: ${transcription}`)
//   console.log(`Transcription: ${transcription}`);

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))