require('dotenv').config();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;
const dbUrl = process.env.MONGO_URI;
corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
};

module.exports = {
  host,
  port,
  dbUrl,
  corsOptions,
};
