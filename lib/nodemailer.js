require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

/*transporter.sendMail({
    from: 'nodejs@mail.com',
    to: 'nodemailerservice2019@gmail.com',
    subject: 'Проверка',
    // text: 'Привет мир',
    html: '<a href="http://localhost:3000">ПЕРЕЙТИ НА LOCALHOST</a>'
}, (err, info) => {
    if (err) return console.error(err);

    console.log(info);
});*/


module.exports = transporter;