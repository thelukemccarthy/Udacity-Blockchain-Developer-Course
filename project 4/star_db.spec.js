const expect = require('chai').expect;
const sinon = require('sinon');
const requireInject = require('require-inject');

//const starDB = require('./star_db');

let putSpy = sinon.spy();
let getSpy = sinon.spy();
let delSpy = sinon.spy();

const dbName = './.verification_data';

// let mockLevelDB = {
//   'level': (dbName) => ({
//     put: putSpy,
//
//     del: delSpy,
//   })
// };

const starDB = requireInject('./star_db', {
  'level' : () => ({
      put: sinon.stub().resolves(putSpy),
      get: sinon.stub().resolves(getSpy)
    })
});

describe.skip('star db', () => {

  beforeEach(() => {
    //putSpy = sinon.spy();

    // mockLevelDB.level().put = putSpy;
    // sinon.spy(starDB, 'level.put');
    //dbfunctions = starDB.level(dbName);
    //dbfunctions.put = putSpy;

  })
  
  afterEach(() => {
    putSpy.resetHistory();
    getSpy.resetHistory();
    delSpy.resetHistory();
  });
  
  it('Given add called then the put method on the db should be called', () => {
    const key = 1;
    const value = 2;

    starDB.add(key, value);
    console.log('putSpy');

    expect(putSpy.calledWith(key, value)).to.be.true;
  });

  it('given a key does not exist in the db then it should return an empty object', async () => {
    const result = await starDB.get('KeyDoesNotExist')
      // .then((result) => {
      //   expect(result).to.deep.equal({});
      //   done();
      // })
    expect(result).to.deep.equal({});
  });
});
