const AccessControl = artifacts.require('GiftRegistryAccessControl');

contract('The Gift Registry Access Control contract', accounts => {
  let contract;
  beforeEach(async () => {
    contract = await AccessControl.new({from: accounts[0]});
  });

  describe('can set', () => {
    it('the gift giver', async () => {
      await contract.setGiftGiver(accounts[1]);
      const giftGiverAddress = await contract.getGiftGiver();
      assert.equal(accounts[1], giftGiverAddress);
    });

    it('the government employee', async () => {
      await contract.setGovernmentEmployee(accounts[2]);
      const governmentEmployee = await contract.getGovernmentEmployee();
      assert.equal(accounts[2], governmentEmployee);
    });

    it('the aproving officer', async () => {
      await contract.setApprovingOfficer(accounts[3]);
      const approvingOfficer = await contract.getApprovingOfficer();
      assert.equal(accounts[3], approvingOfficer);
    });
  });

  describe('validation', async () => {
    it('when addressesMatch is called with matching addresses then true is returned', async () => {
      const result = await contract.addressesMatch(accounts[0], accounts[0], {from: accounts[0]});

      assert.equal(result, true);
    });

    it('when addressesMatch is called with addresses that do NOT match then false is returned', async () => {
      const result = await contract.addressesMatch(accounts[0], accounts[1], {from: accounts[2]});

      assert.equal(result, false);
    });
  });
});