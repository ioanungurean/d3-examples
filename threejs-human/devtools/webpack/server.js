const path = require('path');
const express = require('express');

let app = express();

app.use('/', express.static(path.resolve('public')));
app.listen(3000);
