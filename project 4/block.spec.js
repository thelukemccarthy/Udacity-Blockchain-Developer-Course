const expect = require('chai').expect;
const simpleChain = require('./simpleChain');
const block = require('./block');

describe('simple chain', function() {
  let blockInstance;

  beforeEach(() => {
    blockInstance = new block.Block();
  });

  describe('Block', () => {
    it('null block has the expected values', async () => {
      const expectedNullBlock = {
        'hash': '',
        'height': -1,
        'body': {
          'address': '',
          'star': {
            'dec': '',
            'ra': '',
            'story': ''
          },
        },
        'time': -1,
        'previousBlockHash':''
      };

      const nullBlock = blockInstance.getNullBlock();

      expect(nullBlock).to.deep.equal(expectedNullBlock);
    });
  });
});
