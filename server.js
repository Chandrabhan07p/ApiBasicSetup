const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const mongoose = require('mongoose')
const exceptionHandler = require('./app/handlers/exceptionHandler');

// Uncaught Exc at very top to catch app errors
exceptionHandler.uncaughtException();

const app = require('./app');

const dbString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}/${process.env.DB_NAME}`;

mongoose.connect(dbString).then((con) => {
    console.log('Database connection successful.');
});

const server = app.listen(process.env.PORT, () => {
    console.log(`App started on http://${process.env.HOST}:${process.env.PORT}`);
});

// at last unhandled rejections 
exceptionHandler.unhandledRejection(server);