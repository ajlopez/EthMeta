
const UtilityToken = artifacts.require('./UtilityToken.sol');

contract('UtilityToken', function (accounts) {
    const alice = accounts[0];
    
    beforeEach(async function() {
        this.token = await UtilityToken.new();
    });
    
    it('creator is minter', async function () {
        const result = await this.token.isMinter(alice);
    });
});