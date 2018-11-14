const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const publicPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});
