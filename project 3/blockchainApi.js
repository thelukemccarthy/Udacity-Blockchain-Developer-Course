const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('^/block/:blockId(\[0-9]+)', (req, res) => {
  res.json({blockId: req.params.blockId});
});

app.post('/block', (req, res) => {
  res.json(req.body);
});

app.listen(8000, () => console.log('blockchainApi listening on port 8000!'));

