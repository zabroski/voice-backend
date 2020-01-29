const express = require('express')
const speech = require('@google-cloud/speech');
const fs = require('fs');

const app = express()
const port = 3000


app.get('/', (req, res) => res.send('Hello this is a voice app!'))

app.post('/voice-app', async (req, res) => {

  const client = new speech.SpeechClient();
  const fileName = './issouf/235.wav';
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 'LINEAR16',
    // sampleRateHertz: 48000L,
    languageCode: 'en-US',
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