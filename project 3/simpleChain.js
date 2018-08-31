const SHA256 = require('crypto-js/sha256');
const Block = require('./block');

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

class Blockchain{
  constructor(){
    this.chain = [];
    this.chainLength = 0;
    this.addBlock(new Block.Block("First block in the chain - Genesis block"));
  }

  async addBlock(newBlock){
    newBlock.height = this.chainLength;
    newBlock.time = new Date().getTime().toString().slice(0,-3);

    if(this.chainLength > 0){
      let previousBlock = await this.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = previousBlock.hash;
    }

    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    this.chainLength = this.chainLength + 1
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

    return value;
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
