const bunyan = require('bunyan');
const path   = require('path');

const logger = bunyan.createLogger({
   name: 'LESSON 12',
   streams: [
       {
           level: 'error',
           path: path.join(__dirname, '../logs/errors.log')
       },
       {
           level: 'warn',
           stream: process.stdout
       }
   ]
});

module.exports = logger;