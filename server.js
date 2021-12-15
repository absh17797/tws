const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./configs/database')
const config = require('./configs/configs')
const studentRoutes = require('./routes/students')
const commonService = require('./services/common.js');


app.use(cors())
app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
global.commonService = commonService;

app.all('/', (req, res) => {
    commonService.sendCustomResult(req, res, 'SUCCESS', 'WELCOME_MESSAGE');
})
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/students', studentRoutes);

app.listen(config.PORT, function () {
    console.log(`App listening on port ${config.PORT}`)
})