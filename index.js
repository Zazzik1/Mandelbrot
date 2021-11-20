const express = require('express');
const path = require('path');
const app = express();

app.use('/', express.static(path.join(__dirname, 'static')))

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => `Listening on port ${PORT}.`);