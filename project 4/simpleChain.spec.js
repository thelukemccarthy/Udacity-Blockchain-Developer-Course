const expect = require('chai').expect;

const simpleChain = require('./simpleChain');
const Block = require('./block').Block;



describe('simple chain', function() {
  let blockchain;

  beforeEach(() => {
    blockchain = new simpleChain.Blockchain();
  });

  const getBlocks = index => {
    const blocks = [
      {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":"First block in the chain - Genesis block","time":"1535717009","previousBlockHash":""},
      {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":"test data 10","time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"},
      {"hash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5","height":2,"body":"Second block","time":"1535715696","previousBlockHash":"67900079669d9e0588ea1b89c9774f095af5e0fef46c66547d1e539821e5ae64"},
      {"hash":"656f5d1685d858bbe1fb12458d02df0c18214ff533b09315d34964e4a54ada4e","height":3,"body":"Third block","time":"1535715696","previousBlockHash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5"}
    ];

    return blocks[index];
  };

  describe('genesis block', () => {
    it('is created when the blockchain is created', async () => {
      blockchain = new simpleChain.Blockchain();

      let genesisBlock = await blockchain.getBlock(0);

      expect(genesisBlock.body).to.equal('First block in the chain - Genesis block');
    });
  });

  describe('addBlock', () => {
    it("Genesis block's previousHash should not be set", async ()=> {
      let genesisBlock = await blockchain.getBlock(0);

      expect(genesisBlock.previousBlockHash).to.equal('');
    });

    it('should add the previous blocks hash to the block being added', async ()=> {
      await blockchain.addBlock(new Block('First block'));
      let genesisBlock = await blockchain.getBlock(0);
      let firstBlock = await blockchain.getBlock(1);

      expect(firstBlock.previousBlockHash).to.equal(genesisBlock.hash);
    });

    it('should set the height on the new block correctly', async() => {
      blockchain.addBlock(new Block('First block'));

      let firstBlock = await blockchain.getBlock(1);

      expect(firstBlock.height).to.equal(blockchain.getBlockHeight());
    });

    it('should set a valid hash for the block being added to the chain', async () => {
      blockchain.addBlock(new Block('First block'));

      let firstBlock = await blockchain.getBlock(1);
      let isBlockValid = await blockchain.validateBlock(1);

      expect(firstBlock.hash).to.be.a('string');
      expect(isBlockValid).to.be.true;
    });
  });

  describe('getBlock', () => {
    it('return the correct block', async ()=> {
      await blockchain.addBlock(new Block('First block'));
      await blockchain.addBlock(new Block('Second block'));
      await blockchain.addBlock(new Block('Third block'));

      expect((await blockchain.getBlock(1)).body).to.equal('First block');
      expect((await blockchain.getBlock(2)).body).to.equal('Second block');
      expect((await blockchain.getBlock(3)).body).to.equal('Third block');
    });
  });

  describe('getBlockHeight', () => {
    it('returns zero after the genesis block is created', () => {
      expect(blockchain.getBlockHeight()).to.equal(0);
    });

    it('returns 1 after the first block is created', async () => {
      await blockchain.addBlock(new Block('First block'));

      expect(blockchain.getBlockHeight()).to.equal(1);
    });
  });

  describe('validate block', () => {
    it('when a block is added it should validate', async () => {
      await blockchain.addBlock(new Block('First block'));

      let result = await blockchain.validateBlock(1);
      expect(result).to.equal(true);
    });

    it('when a block is tampered with it should fail validation', async () => {
      blockchain.getBlock = (index) => {
        const blocks = [
            {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":"First block in the chain - Genesis block","time":"1535717009","previousBlockHash":""},
            {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":"Tampered Block!","time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"}
          ];

        return blocks[index];
      }

      let result = await blockchain.validateBlock(1);
      expect(result).to.equal(false);
    });

    it('when a block is tampered with previous blocks should validate', async () => {
      blockchain.getBlock = (index) => {
        const blocks = [
          {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":"First block in the chain - Genesis block","time":"1535717009","previousBlockHash":""},
          {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":"Tampered Block!","time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"}
        ];

        return blocks[index];
      }

      let result = await blockchain.validateBlock(0);
      expect(result).to.equal(true);
    });
  });

  describe('validate blockchain', () => {
    beforeEach(() => {
      for (var i = 0; i <= 10; i++) {
        blockchain.addBlock(new Block('test data ' + i));
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
      blockchain.getBlock = (index) => {
        const blocks = [
          {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":"First block in the chain - Genesis block","time":"1535717009","previousBlockHash":""},
          {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":"Tampered Block!","time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"}
        ];

        return blocks[index];
      }
      blockchain.getBlockHeight = () => 1;

      let result = blockchain.validateChain();

      expect(result).to.equal(1);
    });

    it('given multiple invalid blocks in the chain then validateChain should return the number of invalid blocks', () => {
      blockchain.getBlock = index => {
        const blocks = [
          {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":"First block in the chain - Genesis block","time":"1535717009","previousBlockHash":""},
          {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":"Tampered Block!","time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"},
          {"hash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5","height":2,"body":"Tampered Block!","time":"1535715696","previousBlockHash":"67900079669d9e0588ea1b89c9774f095af5e0fef46c66547d1e539821e5ae64"},
          {"hash":"656f5d1685d858bbe1fb12458d02df0c18214ff533b09315d34964e4a54ada4e","height":3,"body":"Tampered Block!","time":"1535715696","previousBlockHash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5"}
        ];

        return blocks[index];
      };
      blockchain.getBlockHeight = () => 3;

      let result = blockchain.validateChain();

      expect(result).to.equal(3);
    });
  });
});
