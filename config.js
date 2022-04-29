const dotenv = require('dotenv').config();

module.exports = {
   HOST: process.env.HOST || '',
   USER: process.env.USER || '',
   DATABASE: process.env.DATABASE || '',
   PASSWORD: process.env.PASSWORD || ''
};