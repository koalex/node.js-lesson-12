const bunyan = require('bunyan');
const path   = require('path');

const logger = bunyan.createLogger({
   name: 'NODE.js APP',
   streams: [
       {
           level: 'error',
           path: path.join(__dirname, '../logs/errors.log')
       }
   ]
});

module.exports = logger;
