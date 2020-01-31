const express = require('express')
const speech = require('@google-cloud/speech');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded())


app.get('/', (req, res) => res.send('Hello this is a voice app!'))

app.post('/transform-audio-to-text', async (req, res) => {

  // console.log("body is: ", req.body);
  const client = new speech.SpeechClient();

  // const audioBytes = req.body.base64Audio.split(';base64,').pop();

  const fileName = './issouf/download.wav';
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 8000,
    languageCode: 'en-US',
    enableWordConfidence: true,
    enableWordTimeOffsets: true
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