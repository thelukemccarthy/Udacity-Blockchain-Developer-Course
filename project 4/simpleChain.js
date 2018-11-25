const SHA256 = require('crypto-js/sha256');
const Block = require('./block');

const level = require('level');
const dbName = './chaindata';
const db = level(dbName);

class Blockchain{
  constructor(){
    this.chain = [];
    this.chainLength = 0;

    const genesisBlock = Block.Block.createGenesisBlock();

    this.addBlock(genesisBlock);
  }

  createBlockToStore(data) {
    const star = Object.assign({star: {}}, data);
    star.star.story = data && data.star && data.star.story && data.star.story.substring(0, 250) || '';
    star.star.story = Buffer.from(star.star.story, 'utf8').toString('hex');

    return {
      'hash': '',
      'body': {
        'address': star.address,
        'star': star.star
      },
      'time': 0,
      'previousBlockHash': ''
    };
  }

  async addBlock(requestData){
    const newBlock =  this.createBlockToStore(requestData)
    newBlock.height = this.chainLength;
    newBlock.time = new Date().getTime().toString().slice(0,-3);

    if(this.chainLength > 0){
      let previousBlock = await this.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = previousBlock.hash;
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    this.chainLength = this.chainLength + 1;
    await db.put(newBlock.height, JSON.stringify(newBlock))
      .catch((err) => {
        console.log('Block ' + key + ' submission failed', err)
      });

      return newBlock;
  }

  getBlockHeight(){
    return this.chainLength-1;
  }

  async getBlock(blockHeight){
    let value = await db.get(blockHeight)
      .then(result => {
        return JSON.parse(result);
      })
      .catch(error => { console.log('unhandledRejection', error) });

    if(value && value.body && value.body.star && value.body.star.story){
      value.body.star.storyDecoded = Buffer.from(value.body.star.story, 'hex').toString('utf8');
    }

    return value;
  }

  async getBlocksByAddress(blockAddress){
    let result = []
    for(let i = 0; i < this.chainLength; i++) {
      const block = await this.getBlock(i);
      if(block.body.address === blockAddress){
        result.push(block);
      }
    }

    return result;
  }


  async getBlockByHash(blockHash){
    for(let i = 0; i < this.chainLength; i++) {
      const block = await this.getBlock(i);
      if(block.hash === blockHash){
        return block
      }
    }

    return undefined;
  }

  async validateBlock(blockHeight){
    let block = await this.getBlock(blockHeight);
    let blockHash = block.hash;

    block.hash = '';
    let validBlockHash = SHA256(JSON.stringify(block)).toString();

    if (blockHash===validBlockHash) {
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

  validateChain(){
    let errorLog = [];
    for (var i = 0; i < this.getBlockHeight(); i++) {

      if (!this.validateBlock(i))
        errorLog.push(i);

      let blockHash = this.getBlock(i).hash;
      let previousHash = this.getBlock(i+1).hash;
      if (blockHash!==previousHash) {
        errorLog.push(i);
      }
    }

    if (errorLog.length>0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }

    return errorLog.length;
  }
}

module.exports = {
  Blockchain
}
