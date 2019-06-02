const GiftRegistry = artifacts.require('GiftRegistryBase');
const truffleAssert = require('truffle-assertions');

contract('The Gift Registry Base contract', accounts => {
  let contract;

  const OfferedStatus = 0;
  const ReceivedStatus = 1;
  const AcceptedStatus = 2;
  const ApprovedStatus = 3;
  const RetainedStatus = 4;
  const RejectedStatus = 5;
  const ReturnedStatus = 6;

  beforeEach(async () => {
    contract = await GiftRegistry.new({from: accounts[0]});
  });

  describe('given getGift is called', () => {
    it('when the giftId does not exist then the contract should revert', async ()=> {
      await truffleAssert.reverts(contract.getGift(10), 'Gift not found');
    });
  });

  describe('given isGiftReceived is called with a status of', () => {
    it('Offered then false should be returned', async () => {
      const result = await contract.isGiftReceived(OfferedStatus);

      assert.isFalse(result);
    });

    it('Received then false should be returned', async () => {
      const result = await contract.isGiftReceived(ReceivedStatus);

      assert.isTrue(result);
    });

    it('Accepted then false should be returned', async () => {
      const result = await contract.isGiftReceived(AcceptedStatus);

      assert.isFalse(result);
    });

    it('Approved then false should be returned', async () => {
      const result = await contract.isGiftReceived(ApprovedStatus);

      assert.isFalse(result);
    });

    it('Retained then false should be returned', async () => {
      const result = await contract.isGiftReceived(RetainedStatus);

      assert.isFalse(result);
    });

    it('Rejected then false should be returned', async () => {
      const result = await contract.isGiftReceived(RejectedStatus);

      assert.isFalse(result);
    });

    it('Returned then false should be returned', async () => {
      const result = await contract.isGiftReceived(ReturnedStatus);

      assert.isFalse(result);
    });
  });

  describe('given isGiftAccepted is called with a status of', () => {
    it('OfferedStatus then false should be returned', async () => {
      const result = await contract.isGiftAccepted(OfferedStatus);

      assert.isFalse(result);
    });

    it('Received then false should be returned', async () => {
      const result = await contract.isGiftAccepted(ReceivedStatus);

      assert.isFalse(result);
    });

    it('Accepted then true should be returned', async () => {
      const result = await contract.isGiftAccepted(AcceptedStatus);

      assert.isTrue(result);
    });

    it('Approved then false should be returned', async () => {
      const result = await contract.isGiftAccepted(ApprovedStatus);

      assert.isFalse(result);
    });

    it('Retained then false should be returned', async () => {
      const result = await contract.isGiftAccepted(RetainedStatus);

      assert.isFalse(result);
    });

    it('Rejected then false should be returned', async () => {
      const result = await contract.isGiftAccepted(RejectedStatus);

      assert.isFalse(result);
    });

    it('Returned then false should be returned', async () => {
      const result = await contract.isGiftAccepted(ReturnedStatus);

      assert.isFalse(result);
    });
  });

  describe('given isGiftRejected is called with a status of', () => {
    it('OfferedStatus then false should be returned', async () => {
      const result = await contract.isGiftRejected(OfferedStatus);

      assert.isFalse(result);
    });

    it('Received then false should be returned', async () => {
      const result = await contract.isGiftRejected(ReceivedStatus);

      assert.isFalse(result);
    });

    it('Accepted then false should be returned', async () => {
      const result = await contract.isGiftRejected(AcceptedStatus);

      assert.isFalse(result);
    });

    it('Approved then false should be returned', async () => {
      const result = await contract.isGiftRejected(ApprovedStatus);

      assert.isFalse(result);
    });

    it('Retained then false should be returned', async () => {
      const result = await contract.isGiftRejected(RetainedStatus);

      assert.isFalse(result);
    });

    it('Rejected then true should be returned', async () => {
      const result = await contract.isGiftRejected(RejectedStatus);

      assert.isTrue(result);
    });

    it('Returned then false should be returned', async () => {
      const result = await contract.isGiftRejected(ReturnedStatus);

      assert.isFalse(result);
    });
  });

  describe('given isGiftApproved is called with a status of', () => {
    it('OfferedStatus then false should be returned', async () => {
      const result = await contract.isGiftApproved(OfferedStatus);

      assert.isFalse(result);
    });

    it('Received then false should be returned', async () => {
      const result = await contract.isGiftApproved(ReceivedStatus);

      assert.isFalse(result);
    });

    it('Accepted then false should be returned', async () => {
      const result = await contract.isGiftApproved(AcceptedStatus);

      assert.isFalse(result);
    });

    it('Approved then true should be returned', async () => {
      const result = await contract.isGiftApproved(ApprovedStatus);

      assert.isTrue(result);
    });

    it('Retained then false should be returned', async () => {
      const result = await contract.isGiftApproved(RetainedStatus);

      assert.isFalse(result);
    });

    it('Rejected then false should be returned', async () => {
      const result = await contract.isGiftApproved(RejectedStatus);

      assert.isFalse(result);
    });

    it('Returned then false should be returned', async () => {
      const result = await contract.isGiftApproved(ReturnedStatus);

      assert.isFalse(result);
    });
  });
});