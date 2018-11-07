const express = require('express');
const bodyParser = require('body-parser');
const simpleChain = require('./simpleChain').Blockchain;
const Block = require('./block').Block;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const blockchain = new simpleChain();
const block = new Block();

app.get('^/block/:blockId(\[0-9]+)', async (req, res) => {
  const existingBlock = await blockchain.getBlock(req.params.blockId);

  if(existingBlock) {
	  res.type('json').json(existingBlock);
  } else {
	  const errorBlock = block.getNullBlock();
	  errorBlock.error = '404 Block ' + req.params.blockId + ' not found!';
	  res.status(404).type('json').json(errorBlock);
  }
});

app.post('/block', async (req, res) => {
  let newBlock;

  newBlock = await blockchain.addBlock(req.body)
    .catch(error => {
    });

  res.json(newBlock);
});

app.listen(8000, () => console.log('blockchainApi listening on port 8000!'));
