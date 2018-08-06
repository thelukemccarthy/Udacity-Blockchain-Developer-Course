var expect    = require('chai').expect;
var simpleChain = require('./simpleChain');

describe('simple chain', function() {
  let blockchain;

  beforeEach(() => {
    blockchain = new simpleChain.Blockchain();
  });

  describe('genesis block', () => {
    it('is created when the blockchain is created', () => {
      blockchain = new simpleChain.Blockchain();
      console.log(blockchain.chain[0]);
      expect(blockchain.chain[0].body).to.equal('First block in the chain - Genesis block');
    });
  });

  describe('addBlock', () => {
    it("Genesis block's previousHash should not be set", ()=> {
      let genesisBlock = blockchain.getBlock(0);

      expect(genesisBlock.previousBlockHash).to.equal('');
    });

    it('should add the previous blocks hash to the block being added', ()=> {
      blockchain.addBlock(new simpleChain.Block('First block'));
      let genesisBlock = blockchain.getBlock(0);
      let firstBlock = blockchain.getBlock(1);

      expect(firstBlock.previousBlockHash).to.equal(genesisBlock.hash);

    });

    it('should set the height on the new block correctly', () => {
      blockchain.addBlock(new simpleChain.Block('First block'));

      let firstBlock = blockchain.getBlock(1);

      expect(firstBlock.height).to.equal(blockchain.getBlockHeight());
    });

    it('should set a valid hash for the block being added to the chain', () => {
      blockchain.addBlock(new simpleChain.Block('First block'));

      let firstBlock = blockchain.getBlock(1);

      expect(firstBlock.hash).to.be.a('string');
      expect(blockchain.validateBlock(1)).to.be.true;
    });
  });

  describe('getBlock', () => {
    it('return the correct block', ()=> {
      blockchain.addBlock(new simpleChain.Block('First block'));
      blockchain.addBlock(new simpleChain.Block('Second block'));
      blockchain.addBlock(new simpleChain.Block('Third block'));

      expect(blockchain.getBlock(1).body).to.equal('First block');
      expect(blockchain.getBlock(2).body).to.equal('Second block');
      expect(blockchain.getBlock(3).body).to.equal('Third block');
    });
  });

  describe('getBlockHeight', () => {
    it('returns zero after the genesis block is created', () => {
      expect(blockchain.getBlockHeight()).to.equal(0);
    });

    it('returns 1 after the first block is created', () => {
      blockchain.addBlock(new simpleChain.Block('First block'));

      expect(blockchain.getBlockHeight()).to.equal(1);
    });
  });

  describe('validate block', () => {
    it('when a block is added it should validate', () => {
      blockchain.addBlock(new simpleChain.Block('First block'));

      let result = blockchain.validateBlock(1);
      expect(result).to.equal(true);
    });

    it('when a block is tampered with it should fail validation', () => {
      blockchain.addBlock(new simpleChain.Block('First block'));
      let block = blockchain.chain[1];
      block.data = "Tampered Block!";

      let result = blockchain.validateBlock(1);
      expect(result).to.equal(false);
    });

    it('when a block is tampered with previous blocks should validate', () => {
      blockchain.addBlock(new simpleChain.Block('First block'));
      let block = blockchain.chain[1];
      block.data = "Tampered Block!";

      let result = blockchain.validateBlock(0);
      expect(result).to.equal(true);
    });
  });

  describe('validate blockchain', () => {
    beforeEach(() => {
      // setup blockchain
      for (var i = 0; i <= 10; i++) {
        blockchain.addBlock(new simpleChain.Block('test data ' + i));
      }
    });

    manipulateBlockchain = (inducedErrorBlocks) => {
      for (var i = 0; i < inducedErrorBlocks.length; i++) {
        blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
      }
    };

    it('given only valid blocks in the chain then validateChain should return 0', () => {
      let result = blockchain.validateChain();

      expect(result).to.equal(0);
    });

    it('given an invalid block in the chain then validateChain should return 1', () => {
      let inducedErrorBlocks = [2];
      manipulateBlockchain(inducedErrorBlocks);

      let result = blockchain.validateChain();

      expect(result).to.equal(1);
    });

    it('given multiple invalid blocks in the chain then validateChain should return the number of invalid blocks', () => {
      let inducedErrorBlocks = [2,4,7];
      manipulateBlockchain(inducedErrorBlocks);

      let result = blockchain.validateChain();

      expect(result).to.equal(3);
    });
  });
});
