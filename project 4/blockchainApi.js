const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const simpleChain = require('./simpleChain').Blockchain;
const Block = require('./block').Block;
const validateAddress = require('./validateAddress')

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

app.get('^/stars/address\::addressValue', async (req, res) => {
  const existingBlocks = await blockchain.getBlocksByAddress(req.params.addressValue);

  res.type('json').json(existingBlocks);

});

app.get('^/stars/hash\\::hashValue', async (req, res) => {
  const existingBlock = await blockchain.getBlockByHash(req.params.hashValue);

  if(existingBlock) {
    res.type('json').json(existingBlock);
  } else {
    const errorBlock = block.getNullBlock();
    errorBlock.error = '404 Block ' + req.params.blockId + ' not found!';
    res.status(404).type('json').json(errorBlock);
  }
});

app.post('/requestValidation', async (req, res) => {
  const address = req.body.address;
  let existingResponse = await validateAddress.getExistingValidation(address);
  if(existingResponse.status){
    existingResponse = existingResponse.status;
    delete existingResponse.messageSignature;
  }

  const validationResponse = Object.assign(validateAddress.createValidationResponse(address), existingResponse);

  const responseObj = validateAddress.updateValidationResponse(validationResponse);

  await validateAddress.saveValidation(address, responseObj);

  res.json(responseObj);
});

app.post('/message-signature/validate', async (req, res) => {

  const address = req.body.address;
  const signature = req.body.signature;
  const existingResponse = await validateAddress.getExistingValidation(address);

  const responseObj = Object.assign({}, validateAddress.createSignatureResponse(address, signature, existingResponse));
  await validateAddress.saveValidation(address, responseObj);

  res.json(responseObj);
});

app.post('/block', async (req, res) => {
  const address = req.body.address || "";
  const verification = await validateAddress.getExistingValidation(address);
  const isVerified = validateAddress.isAddressVerified(verification);

  if(!isVerified){
    const errorRes = {
      'error': '400 verification failed make sure you have registered your address, ' +
        'signed the message and registered the star before the verification expires',
      verification
    };
    res.status(400).type('json').json(errorRes);
    return;
  }

  let newBlock;
  newBlock = await blockchain.addBlock(req.body)
    .catch(error => {
    });

  res.json(newBlock);
});

app.listen(8000, () => console.log('blockchainApi listening on port 8000!'));
