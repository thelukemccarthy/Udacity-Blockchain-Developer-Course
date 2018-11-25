const expect = require('chai').expect;

const simpleChain = require('./simpleChain');
const Block = require('./block').Block;



describe('simple chain', function() {
  let blockchain;

  beforeEach(() => {
    blockchain = new simpleChain.Blockchain();
  });

  const createBlockBody = story => ({
      'address': '',
      'star': {
        'dec': '',
        'ra': '',
        'story': story,
      }
  })

  const decodeFromHex = (value) => Buffer.from(value, 'hex').toString('utf8')

  const GENESIS_BLOCK_TEXT_ENCODED_IN_HEX = '466972737420626c6f636b20696e2074686520636861696e202d2047656e6573697320626c6f636b';

  const getBlocks = index => {
    const blocks = [
      {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":createBlockBody("First block in the chain - Genesis block"),"time":"1535717009","previousBlockHash":""},
      {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":createBlockBody("test data 10"),"time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"},
      {"hash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5","height":2,"body":createBlockBody("Second block"),"time":"1535715696","previousBlockHash":"67900079669d9e0588ea1b89c9774f095af5e0fef46c66547d1e539821e5ae64"},
      {"hash":"656f5d1685d858bbe1fb12458d02df0c18214ff533b09315d34964e4a54ada4e","height":3,"body":createBlockBody("Third block"),"time":"1535715696","previousBlockHash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5"}
    ];

    return blocks[index];
  };

  describe('genesis block', () => {
    it('is created when the blockchain is created', async () => {
      blockchain = new simpleChain.Blockchain();

      let genesisBlock = await blockchain.getBlock(0);

      expect(decodeFromHex(genesisBlock.body.star.story)).to.equal('First block in the chain - Genesis block');
    });
  });

  describe('createBlockToStore', () => {
    const defaultStar = {
      "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
      "star": {
        "dec": "-26° 29' 24.9",
        "ra": "16h 29m 1.0s",
        "story": "This is 100 characters long 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 123456" +
          "This is 100 characters long 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 123456" +
          "This is 100 characters long 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 123456" +
          "This is 100 characters long 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 123456" +
          "This is 100 characters long 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 123456" +
          "This is 100 characters long 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 123456"
      }
    }

    it('given the defaultStar when createBlockToStore is called the length of the story should be truncated to 500 characters', () => {
      const result = blockchain.createBlockToStore(defaultStar);

      expect(result.body.star.story.length).to.equal(500);
    });

    it('given the defaultStar when createBlockToStore is called the story should be returned as a hex encoded string', () => {
      const input = defaultStar.star.story.substring(0, 250);
      const expected = Buffer.from(input, 'utf8').toString('hex');

      const result = blockchain.createBlockToStore(defaultStar);

      expect(result.body.star.story).to.equal(expected);
    });

    it('given the defaultStar when createBlockToStore is called the object returned should have all fields defined', () => {
      const result = blockchain.createBlockToStore(defaultStar);

      expect(result.hash).to.equal('');
      expect(result.body.address).to.equal(defaultStar.address);
      expect(result.body.star.dec).to.equal(defaultStar.star.dec);
      expect(result.body.star.ra).to.equal(defaultStar.star.ra);
      expect(result.time).to.equal(0);
      expect(result.previousBlockHash).to.equal('');
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
      await blockchain.addBlock(createBlockBody('First block'));
      await blockchain.addBlock(createBlockBody('Second block'));
      await blockchain.addBlock(createBlockBody('Third block'));

      expect(decodeFromHex((await blockchain.getBlock(1)).body.star.story)).to.equal('First block');
      expect(decodeFromHex((await blockchain.getBlock(2)).body.star.story)).to.equal('Second block');
      expect(decodeFromHex((await blockchain.getBlock(3)).body.star.story)).to.equal('Third block');
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
      // this isn't a good way to test this as it can cause the tests to fail sometimes, I should change this to use requireInject
      blockchain.getBlock = (index) => {
        const blocks = [
            {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":createBlockBody("First block in the chain - Genesis block"),"time":"1535717009","previousBlockHash":""},
            {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":createBlockBody("Tampered Block!"),"time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"}
          ];

        return blocks[index];
      }

      let result = await blockchain.validateBlock(1);
      expect(result).to.equal(false);
    });

    it('when a block is tampered with previous blocks should validate', async () => {
      // this isn't a good way to test this as it can cause the tests to fail sometimes, I should change this to use requireInject
      blockchain.getBlock = (index) => {
        const blocks = [
          {"hash":"fde78da7bb257855c5c742f910825691938ce4ac4de3e8dfa85706a9a2617342","height":0,"body":createBlockBody("First block in the chain - Genesis block"),"time":"1535717009","previousBlockHash":""},
          {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":createBlockBody("Tampered Block!"),"time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"}
        ];

        return blocks[index];
      }

      const block = await blockchain.getBlock(0);

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
      // this isn't a good way to test this as it can cause the tests to fail sometimes, I should change this to use requireInject
      blockchain.getBlock = (index) => {
        const blocks = [
          {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":createBlockBody("First block in the chain - Genesis block"),"time":"1535717009","previousBlockHash":""},
          {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":createBlockBody("Tampered Block!"),"time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"}
        ];

        return blocks[index];
      }
      const restore = blockchain.getBlockHeight;
      blockchain.getBlockHeight = () => 1;

      let result = blockchain.validateChain();

      expect(result).to.equal(1);
    });

    it('given multiple invalid blocks in the chain then validateChain should return the number of invalid blocks', () => {
      // this isn't a good way to test this as it can cause the tests to fail sometimes, I should change this to use requireInject
      blockchain.getBlock = index => {
        const blocks = [
          {"hash":"d9622f01bf654ecdc9ed8b957cf15e6f356d3a362a6c8a6fad61fa377ae3013b","height":0,"body":createBlockBody("First block in the chain - Genesis block"),"time":"1535717009","previousBlockHash":""},
          {"hash":"90ebe996fa97b02e83497dd268a140c66d60bf95a8d2d597a7202f9003be2b85","height":1,"body":createBlockBody("Tampered Block!"),"time":"1535715696","previousBlockHash":"c5bacf73ba4ea6fb466701825cd91454a3647a4ba2951e0f668343ad8d48cdd6"},
          {"hash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5","height":2,"body":createBlockBody("Tampered Block!"),"time":"1535715696","previousBlockHash":"67900079669d9e0588ea1b89c9774f095af5e0fef46c66547d1e539821e5ae64"},
          {"hash":"656f5d1685d858bbe1fb12458d02df0c18214ff533b09315d34964e4a54ada4e","height":3,"body":createBlockBody("Tampered Block!"),"time":"1535715696","previousBlockHash":"853cd41fa6f02f155241585699add6fafb83764860211209b09a7083ae0a18c5"}
        ];

        return blocks[index];
      };
      blockchain.getBlockHeight = () => 3;

      let result = blockchain.validateChain();

      expect(result).to.equal(3);
    });
  });
});
