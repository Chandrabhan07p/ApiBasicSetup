const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const mongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const path = require('path');
const features = require('./app/utils/apiFeatures');
const globalErrorHandler = require('./app/handlers/errorHandler');


// inital middlewares

// headers
app.use(helmet());
const corsOptions = {
    origin: 'http://localhost:3000', // react app origin 
    credentials: true
};
app.use(cors(corsOptions));

app.use(mongoSantize());
app.use(xss());

// limiter
const rateLimitOptions = {
    max: 200,
    windowMs: 1000 * 60 * 60,
    message: "Too many requests from this IP. please try again later!"
};

app.use('/api', rateLimit(rateLimitOptions));
app.use(express.json({ limit: '10kb' }));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// views 
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

app.use(globalErrorHandler);

module.exports = app;

