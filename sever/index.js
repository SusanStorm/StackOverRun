import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import { Configuration, OpenAIApi } from 'openai'
import userRoutes from './routes/users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import bodyParser from"body-parser";
import socialMediaRoutes from './routes/socialMediaRoutes.js'
import subscriptionRoutes from './routes/suscription.js'

dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);


  const app = express();
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors());

app.get('/',(req, res) => {
    res.send("This is a stack overflow clone API")
})

app.use('/user', userRoutes)
app.use('/questions', questionRoutes)
app.use('/answer', answerRoutes)
app.use('/socialmedia', socialMediaRoutes)
app.use('/subs', subscriptionRoutes);
app.use(bodyParser.json());


// Define a route for the root path that listens for POST requests
app.post("/", async (req, res) => {
  // When a request is received, create a text completion request using the OpenAI API
  const { message, currentModel } = req.body;
  //console.log(message);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${message}`,
    max_tokens: 1000,
    temperature:0.5,
  });

  // Send the response data back to the client in JSON format
  res.json({
    // data: response.data,
    message: response.data.choices[0].text,
  });
});

const PORT = process.env.PORT || 5000
mongoose.set('strictQuery',false);
const DATABASE_URL = process.env.CONNECTION_URL

mongoose.connect( DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => {console.log(`server running on port ${PORT}`)}))
    .catch((err) => console.log(err.message))