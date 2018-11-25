const expect = require('chai').expect;
const requireInject = require('require-inject');

const frozenTime = 1542276307018;

var validateAddress = requireInject('./validateAddress', {
  'moment': () => ({format: () => frozenTime})
});

describe('validate address', () => {
  const address = '1FeNfPF9w31VbQMTcjMmZikexvpovSKZis';

  it('given an address then a json object should be returned with the fields address, requestTimeStamp, message, validationWindow', () => {
    let result = validateAddress.createValidationResponse();

    expect(result).to.have.all.keys('address', 'requestTimeStamp', 'message', 'validationWindow');
  });

  it(`given an address of ${address} when createValidationResponse is called then a json object should be returned with the address field set the address passed in`, () => {
    let result = validateAddress.createValidationResponse(address);

    expect(result.address).to.equal(address);
  });

  it('given an address then a json object should be returned with the validationWindow set to 300 seconds', () => {
    let result = validateAddress.createValidationResponse(address);

    expect(result.validationWindow).to.equal(300);
  });

  it('given an address then a json object should be returned with the requestTimeStamp set to the current time', () => {
    let result = validateAddress.createValidationResponse(address);

    expect(result.requestTimeStamp).to.equal(frozenTime);
  });

  it('given an address then a json object should be returned with the message set to <address>:<requestTimeStamp>:starRegistry', () => {
    let result = validateAddress.createValidationResponse(address);

    expect(result.message).to.equal(address + ':' + frozenTime + ':starRegistry');
  });
});