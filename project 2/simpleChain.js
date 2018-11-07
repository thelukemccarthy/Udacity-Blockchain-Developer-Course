/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = '',
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ''
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.chainLength = 0;
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  async addBlock(newBlock){
    // Block height
    newBlock.height = this.chainLength;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chainLength > 0){
      let previousBlock = await this.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = previousBlock.hash;
    }

    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    this.chainLength = this.chainLength + 1
    await db.put(newBlock.height, JSON.stringify(newBlock))
      .catch((err) => {
        console.log('Block ' + key + ' submission failed', err)
      });

      return newBlock;
  }

  // Get block height
  getBlockHeight(){
    return this.chainLength-1;
  }

  // get block
  async getBlock(blockHeight){
    let value = await db.get(blockHeight)
      .then(result => {
        return JSON.parse(result);
      })
      .catch(error => { console.log('unhandledRejection', error) });

    return value;
  }

  async validateBlock(blockHeight){
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

 // Validate blockchain
  validateChain(){
    let errorLog = [];
    for (var i = 0; i < this.getBlockHeight(); i++) {
      // validate block
      if (!this.validateBlock(i))errorLog.push(i);

      // compare blocks hash link
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
  Block,
  Blockchain
}
