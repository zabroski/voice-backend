const express = require('express')
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');
var cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({limit: '150mb'}));
app.use(express.urlencoded({limit: '150mb'}));

app.get('/', (req, res) => res.send('Hello this is a voice app!'))

app.post('/transform-audio-to-text', async (req, res) => {

  const client = new speech.SpeechClient();
  const audioBytes = req.body.base64Audio.split(';base64,').pop();
  const language = req.body.language || 'en-US';

  console.log(req.body.language, " <----- ");

  const audio = {
    content: audioBytes,
  };

  console.log("my language is: ", language);

  const config = {
    encoding: 'LINEAR16',
    languageCode: language, //fr-FR
    enableWordTimeOffsets: true,
    enableWordConfidence: true,
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