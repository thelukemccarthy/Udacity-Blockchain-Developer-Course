const expect = require('chai').expect;
const requireInect = require('require-inject');
const sinon = require('sinon');

const block = require('./block');

describe('blockchainApi', () => {
  let simpleChain;
  let getSpy = sinon.spy();
  let postSpy = sinon.spy();
  let listenSpy = sinon.spy();

  before(() => {
    simpleChain = requireInect('./blockchainApi', {
      express : () => {
        return {
          get: getSpy,
          post: postSpy,
          listen: listenSpy,
          use: sinon.spy()
        };
      }
    });
  });

  describe('get request', () => {
    it('is setup to respond to the uri /block/:blockId', () => {
      expect(getSpy.calledWith('^/block/:blockId([0-9]+)')).to.equal(true);
    });
  });

  describe('post request', () => {
    it('the post request is setup to respond to the uri /block', () => {
      expect(postSpy.calledWith('/block')).to.equal(true);
    });
  });

  describe('server', () => {
    it('listens on port 8000', () => {
      expect(listenSpy.calledWith(8000)).to.equal(true);
    });
  });

});