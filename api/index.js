require('dotenv').config();

const express = require('express');
const helmet = require('helmet')
const cors = require('cors');
const morgan = require('morgan');

const registration = require('./routes/registration.js');

const notFound = require('./middlewares/notFound.js');
const errorHandler = require('./middlewares/errorHandler.js');
const rateLimit = require('express-rate-limit');



const port = process.env.PORT || 8080;
const host = process.env.NODE_ENV === 'production' ? process.env.HOST : 'http://localhost';



const app = express();
app.use(cors({  origin: host  }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// app.use(rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100
// }));


app.use('/auth', registration);

app.get('/', (req, res) => {
    res.send('Hello');
});


app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>{
    console.log(`listening on port http://localhost:${port}`, new Date());
});