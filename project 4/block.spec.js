const expect = require('chai').expect;
const simpleChain = require('./simpleChain');
const block = require('./block');

describe('simple chain', function() {
  let blockInstance;

  beforeEach(() => {
    blockInstance = new block.Block();
  });

  describe('Block', () => {
    it('is created when the blockchain is created', async () => {
      const expectedNullBlock = {
        'hash': '',
        'height': -1,
        'body': '',
        'time':'',
        'previousBlockHash':''
      };

      const nullBlock = blockInstance.getNullBlock();

      expect(nullBlock).to.deep.equal(expectedNullBlock);
    });
  });
});
