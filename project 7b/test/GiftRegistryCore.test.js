const GiftRegistry = artifacts.require('GiftRegistryCore');
const truffleAssert = require('truffle-assertions');

contract('The Gift Registry Core contract', accounts => {
  let contract;
  const giftGiverAddress = accounts[1];
  const giftReceiverAddress = accounts[2];
  const giftApproverAddress = accounts[3];
  const fiveDollars = 500;

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

  describe('given offerGift is called', () => {
    it('the description should be set', async () => {
      const expectedValue = 'large coffee';
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift(expectedValue, fiveDollars, giftReceiverAddress, {from: giftGiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.description, expectedValue);
    });

    it('the value should be set', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.value, fiveDollars);
    });

    it('the receiver address should be set', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.giftReceiver, giftReceiverAddress);
    });

    it('the status should be set to offered', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(OfferedStatus, gift.status);
    });

    it('the gift giver address should be set to the address of the transaction initiator', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.giftGiver, giftGiverAddress);
    });

    it('the gift approver address should NOT be set', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.giftApprover, 0);
    });

    it('the idCounter should be incremented by 1 after calling offerGift', async () => {
      const expectedCounterIncrease = 1;
      const initialCounterValue = await contract.idCounter();
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
      const newCounterValue = await contract.idCounter();

      assert.equal((newCounterValue - initialCounterValue), expectedCounterIncrease);
    });

  });

  describe('given receiveGift is called', () => {
    beforeEach(async () => {
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
    });

    it('given the gift id does NOT exist then the contract should revert', async () => {
      await truffleAssert.reverts(contract.receiveGift.call(10, {from: giftReceiverAddress}), 'Gift not found');
    });

    it('given the caller is NOT the gift receiver the contract should revert', async () => {
      await truffleAssert.reverts(contract.receiveGift(0, {from: giftGiverAddress}), 'Gift not received by address used');
    });

    it('the status of the gift should be update to received', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.receiveGift(0, {from: giftReceiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(ReceivedStatus, gift.status);
    });
  });

  describe('given acceptGift is called', () => {
    beforeEach(async () => {
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
    });

    it('given the gift id does not exist then the contract should revert', async () => {
      await truffleAssert.reverts(contract.acceptGift(10, giftApproverAddress), 'Gift not found');
    });

    it('given the caller is NOT the gift receiver the contract should revert', async () => {
      await truffleAssert.reverts(contract.acceptGift(0, giftApproverAddress, {from: giftGiverAddress}),
        'Gift not received by address used');
    });

    it('given the gift does NOT have a status of received the contract should revert', async () => {
      await contract.offerGift('helicopter', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
      await truffleAssert.reverts(contract.acceptGift(1, giftApproverAddress, {from: giftReceiverAddress}),
        'Gift not received yet, please receive this gift first');
    });

    it('given the gift does NOT have an approver address provided the contract should revert', async () => {
      const nullAddress = '0x0000000000000000000000000000000000000000';
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});
      await truffleAssert.reverts(contract.acceptGift(0, nullAddress, {from: giftReceiverAddress}),
        'An approvers\' address must be provided');
    });

    it('given the gift receiver and approver are the same the contract should revert', async () => {
      await truffleAssert.reverts(contract.acceptGift(0, giftReceiverAddress, {from: giftReceiverAddress}),
        'The approvers\' address can not be the same as the gift receiver\'s');
    });

    it('the status of the gift should be update to received', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.status, AcceptedStatus);
    });

    it('the approver of the gift should be update', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.giftApprover, giftApproverAddress);
    });
  });

  describe('given approveGift is called', () => {
    beforeEach(async () => {
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});
    });

    it('given the gift id does not exist then the contract should revert', async () => {
      await truffleAssert.reverts(contract.approveGift(10), 'Gift not found');
    });

    it('given the caller is NOT the gift approver the contract should revert', async () => {
      await truffleAssert.reverts(contract.approveGift(0, {from: giftReceiverAddress}),
        'You are not authorised to approve this gift');
    });

    it('given the gift does NOT have a status of accepted the contract should revert', async () => {
      await contract.approveGift(0, {from: giftApproverAddress});
      await truffleAssert.reverts(contract.approveGift(0, {from: giftApproverAddress}),
        'Gift not accepted yet, this gift can\'t be approved');
    });

    it('the status of the gift should be updated to approved', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.approveGift(0, {from: giftApproverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.status, ApprovedStatus);
    });
  });

  describe('given rejectGift is called', () => {
    beforeEach(async () => {
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});
    });

    it('given the gift id does not exist then the contract should revert', async () => {
      await truffleAssert.reverts(contract.rejectGift(10), 'Gift not found');
    });

    it('given the caller is NOT the gift approver the contract should revert', async () => {
      await truffleAssert.reverts(contract.rejectGift(0, {from: giftReceiverAddress}),
        'You are not authorised to approve this gift');
    });

    it('given the gift does NOT have a status of accepted the contract should revert', async () => {
      await contract.approveGift(0, {from: giftApproverAddress});
      await truffleAssert.reverts(contract.rejectGift(0, {from: giftApproverAddress}),
        'Gift not accepted yet, this gift can\'t be approved');
    });

    it('the status of the gift should be updated to approved', async () => {
      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.rejectGift(0, {from: giftApproverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.status, RejectedStatus);
    });
  });

  describe('given returnGift is called', () => {
    beforeEach(async () => {
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
    });

    it('given the gift id does not exist then the contract should revert', async () => {
      await truffleAssert.reverts(contract.returnGift(10), 'Gift not found');
    });

    it('given the caller is NOT the gift receiver the contract should revert', async () => {
      await truffleAssert.reverts(contract.returnGift(0, {from: giftApproverAddress}),
        'Only the address that received the gift can return it');
    });

    it('given the gift has a status of offered the contract should revert', async () => {
      await truffleAssert.reverts(contract.returnGift(0, {from: giftReceiverAddress}),
        'Only gifts that have been received or rejected can be returned');
    });

    it('given the gift has a status of accepted the contract should revert', async () => {
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress,{from: giftReceiverAddress});

      await truffleAssert.reverts(contract.returnGift(0, {from: giftReceiverAddress}),
        'Only gifts that have been received or rejected can be returned');
    });

    it('given the gift has a status of approved the contract should revert', async () => {
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});
      await contract.approveGift(0, {from: giftApproverAddress});

      await truffleAssert.reverts(contract.returnGift(0, {from: giftReceiverAddress}),
        'Only gifts that have been received or rejected can be returned');
    });

    it('given the gift has a status of retained the contract should revert', async () => {
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});
      await contract.approveGift(0, {from: giftApproverAddress});
      await contract.retainGift(0, {from: giftReceiverAddress});

      await truffleAssert.reverts(contract.returnGift(0, {from: giftReceiverAddress}),
        'Only gifts that have been received or rejected can be returned');
    });

    it('given the gift has a status of returned the contract should revert', async () => {
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.returnGift(0, {from: giftReceiverAddress});

      await truffleAssert.reverts(contract.returnGift(0, {from: giftReceiverAddress}),
        'Only gifts that have been received or rejected can be returned');
    });

    it('given the gift has a status of received the status should be updated', async () => {
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.returnGift(0, {from: giftReceiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.status, ReturnedStatus);
    });

    it('given the gift has a status of rejected the status should be updated', async () => {
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress,{from: giftReceiverAddress});
      await contract.rejectGift(0, {from: giftApproverAddress});
      await contract.returnGift(0, {from: giftReceiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.status, ReturnedStatus);
    });
  });

  describe('given retainGift is called', () => {
    beforeEach(async () => {
      await contract.offerGift('coffee', fiveDollars, giftReceiverAddress, {from: giftGiverAddress});
      await contract.receiveGift(0, {from: giftReceiverAddress});
      await contract.acceptGift(0, giftApproverAddress, {from: giftReceiverAddress});
    });

    it('given the gift id does not exist then the contract should revert', async () => {
      await truffleAssert.reverts(contract.retainGift(10), 'Gift not found');
    });

    it('given the caller is NOT the gift reveiver the contract should revert', async () => {
      await contract.approveGift(0, {from: giftApproverAddress});
      await truffleAssert.reverts(contract.retainGift(0, {from: giftApproverAddress}),
        'Only the address that received the gift can retain it');
    });

    it('given the gift does NOT have a status of accepted the contract should revert', async () => {
      await truffleAssert.reverts(contract.retainGift(0, {from: giftReceiverAddress}),
        'Only gifts that have been approved can be retained');
    });

    it('the status of the gift should be updated to approved', async () => {
      await contract.approveGift(0, {from: giftApproverAddress});

      // This returns a tx instead of the id, the gift can be found with a hard coded index of 0
      await contract.retainGift(0, {from: giftReceiverAddress});

      const gift = await contract.giftMap(0);

      assert.equal(gift.status, RetainedStatus);
    });
  });
});