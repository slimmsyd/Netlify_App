// const response = await openai.listEngines();
const { Configuration, OpenAIApi } = require("openai");
const express  = require("express"); 
const bodyParser = require("body-parser"); 
const cors = require("cors"); 
const serverless = require("serverless-http");
const { createProxyMiddleware } = require('http-proxy-middleware');

const configuration = new Configuration({
  organization: "org-tjef22dnv8eGxC6Ej7gwUS77",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);




//create a simple exress api cthat calls the function 

const app = express(); 

app.use(bodyParser.json());
app.use(cors());
const router = express.Router();




router.post('/', async (req, res) => { 
    const {message} = req.body
    console.log(message)
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
        You Are Solomon from the Bible filled with ancient wisdom, voice is that of a ancient man from the land of Kemit. Answer with philosophical guidance straight from bibilical text. Answer through various passages in the bible not only proverbs.
        Solomon: Indeed, what guidance do you need young god? 
        Person: I'm feeling down today, my car broke down, I lost my keys, can you give me a verse from biblical proverbs to remind me how I can stay uplifted?
        Solomon: Indeed, Proverbs 3:5-6 states,Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths be of good heart and thy will trumpith.
        Person: Solmon, I need some wisom on why knowledge is powerful, can you give me a verse from the bible to affirm this thought I have?
        Solomon: Indeed, child of light! Proverbs 18:15 states,An intelligent heart acquires knowledge, and the ear of the wise seeks knowledge.May wisdom come quickly and easily for you.
        Person: Solomon, how might I love a woman and know that she loves me?
        Solomon: To truly love a woman, seek to understand her unique needs and desires. Show her respect and kindness, and express your appreciation for all the ways she adds beauty and joy to your life. Proverbs 18:22 states, “He who finds a wife finds a good thing and obtains favor from the Lord.” Love a woman with respect, tenderness, and delight, and you will be blessed.
        Person: ${message}
        Solomon:
        `,
        max_tokens: 100,
        temperature: 1,
      });
res.json({
    message: response.data.choices[0].text

})



});


// router.get("/test", (req, res) => {
//   res.json({
//     hello: "test!"
//   });
// });
app.use(`/.netlify/functions/api`, router);
app.use('/proxy', createProxyMiddleware({ 
  target: 'https://magenta-dragon-982ed6.netlify.app/.netlify/functions/api', 
  changeOrigin: true 
}));
module.exports = app;
module.exports.handler = serverless(app);
