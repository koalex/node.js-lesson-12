require('dotenv').config();
const ngrok = require('ngrok');

(async () => {
    const url = await ngrok.connect(isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT));
    console.log(url)
})();