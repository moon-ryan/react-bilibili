const path = require('path');

const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 3000;
const PROJECT_PATH = path.resolve(__dirname, '../');
const PROJECT_NAME = path.parse(PROJECT_PATH).name;
const isDev = process.env.NODE_ENV !== 'production';
module.exports = {
  isDev,
  PROJECT_PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT,
};
