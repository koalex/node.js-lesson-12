const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
});

module.exports = transporter;