const StarNotary = artifacts.require('StarNotary');
const truffleAssert = require('truffle-assertions');

contract('StarNotary', accounts => {
    let contract;
    beforeEach(async () => {
        contract = await StarNotary.new({from: accounts[0]});
    });
    
    describe('can create a star', () => {
        it('can not create a star without name', async () => {
            await truffleAssert.reverts(contract.createStar('', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '4.83', '42', 1, {from: accounts[0]}), 'A star name is required');
        });

        it('can not create a star without a star story', async () => {
            await truffleAssert.reverts(contract.createStar('awesome star!', '', '16h 29m 1.0s', '-26° 29\' 24.9', '4.83', '42', 1, {from: accounts[0]}), 'A star story is required');
        });

        it('can not create a star without ra coordinates', async () => {
            await truffleAssert.reverts(contract.createStar('awesome star!', 'a new awesome star', '', '-26° 29\' 24.9', '4.83', '42', 1, {from: accounts[0]}), 'The star\'s ra is required');
        });

        it('can not create a star without dec coordinates', async () => {
            await truffleAssert.reverts(contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '', '4.83', '42', 1, {from: accounts[0]}), 'The star\'s dec is required');
        });

        it('can not create a star with a tokenId that has already been used', async () => {
          contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '4.83', '42', 1, {from: accounts[0]});
          await truffleAssert.reverts(contract.createStar('second star!', 'a new star with the same tokenId', '17h 30m 2.0s', '-27° 30\' 25.8', '5.94', '53', 1, {from: accounts[0]}), 'The tokenId has already been used');
        });

        it('cannot create a star with ra and dec that already claimed', async () => {
            await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '', '', 1, {from: accounts[0]});

            await truffleAssert.reverts(contract.createStar('double claim', 'stolen star', '16h 29m 1.0s', '-26° 29\' 24.9', '', '', 2, {from: accounts[1]}), 'The star has already been claimed');
        });

        it('can create a star with name, star story, ra, dec, mag, and cen', async () => {
            await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '4.83', '42', 1, {from: accounts[0]});
            const result = await contract.tokenIdToStarInfoMapping(1);

            assert.equal(result[0], 'awesome star!');
            assert.equal(result[1], 'a new awesome star');
            assert.equal(result[2], '16h 29m 1.0s');
            assert.equal(result[3], '-26° 29\' 24.9');
            assert.equal(result[4], '4.83');
            assert.equal(result[5], '42');
        });

        it('can create a star with blank mag, and cen', async () => {
            await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '', '', 1, {from: accounts[0]});
            const result = await contract.tokenIdToStarInfoMapping(1);

            assert.equal(result[0], 'awesome star!');
            assert.equal(result[1], 'a new awesome star');
            assert.equal(result[2], '16h 29m 1.0s');
            assert.equal(result[3], '-26° 29\' 24.9');
            assert.equal(result[4], '');
            assert.equal(result[5], '');
        });
    });

    describe('can get star info', () => {
        it('given a star cannot be found then tokenIdToStarInfo should revert', async function () {
            await truffleAssert.fails(
              contract.tokenIdToStarInfo(135),
              truffleAssert.ErrorType.REVERT,
              "No star found for the token id provided"
            );
        });

        it('given a star has all fields set then tokenIdToStarInfo should return the values with a prefix for all fields except name and starStory', async () => {
            await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '4.83', '42', 1, {from: accounts[0]});
            const result = await contract.tokenIdToStarInfo(1);

            const expected = ['awesome star!', 'a new awesome star', 'ra_16h 29m 1.0s', 'dec_-26° 29\' 24.9', 'mag_4.83', 'cen_42'];

            assert.deepEqual(result, expected);
        });

        it('given a star has not set the optional fields then tokenIdToStarInfo should return empty strings for those fields ', async () => {
            await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '', '', 1, {from: accounts[0]});
            const result = await contract.tokenIdToStarInfo(1);

            const expected = ['awesome star!', 'a new awesome star', 'ra_16h 29m 1.0s', 'dec_-26° 29\' 24.9', '', ''];

            assert.deepEqual(result, expected);
        });
    });

    describe('can check if star already exists', () => {
      it('when a stars coordinates have not been registered then checkIfStarExist should return false', async () => {
        const result = await contract.checkIfStarExist('16h 29m 1.0s', '-26° 29\' 24.9');

        assert.equal(result, false);
      });

      it('when a stars coordinates have been registered then checkIfStarExist should return true', async () => {
        await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '', '', 1, {from: accounts[0]});
        const result = await contract.checkIfStarExist('16h 29m 1.0s', '-26° 29\' 24.9');

        assert.equal(result, true);
      });
    });

    describe('buying and selling stars', () => { 
        let user1 = accounts[1];
        let user2 = accounts[2];
        
        let starId = 1;
        let starPrice = web3.toWei(.01, "ether");

        beforeEach(async () => {
            await contract.createStar('awesome star!', 'a new awesome star', '16h 29m 1.0s', '-26° 29\' 24.9', '4.83', '42', starId, {from: user1});
        });

        it('user1 can put up their star for sale', async () => {
            assert.equal(await contract.ownerOf(starId), user1);
            await contract.putStarUpForSale(starId, starPrice, {from: user1});
            
            assert.equal(await contract.starsForSale(starId), starPrice);
        });

        it('given a star has been put up for sale then starsForSale should return that was put up for sale', async () => {
            assert.equal(await contract.ownerOf(starId), user1);
            await contract.putStarUpForSale(starId, starPrice, {from: user1});
            const result = await contract.starsForSale(starId);

            // BigNumber is returned
            assert.equal(result.s, 1);
            assert.equal(result.e, 16);
        });

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async () => {
                await contract.putStarUpForSale(starId, starPrice, {from: user1});
            });

            it('user2 is the owner of the star after they buy it', async () => {
                await contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0});
                assert.equal(await contract.ownerOf(starId), user2);
            });

            it('user2 ether balance changed correctly', async ()  => {
                let overpaidAmount = web3.toWei(.05, 'ether');
                const balanceBeforeTransaction = web3.eth.getBalance(user2);
                await contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0});
                const balanceAfterTransaction = web3.eth.getBalance(user2);

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice);
            });
        });
    });
});