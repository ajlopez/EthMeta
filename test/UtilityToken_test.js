
const UtilityToken = artifacts.require('./UtilityToken.sol');

contract('UtilityToken', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    
    beforeEach(async function() {
        this.token = await UtilityToken.new();
    });
    
    it('creator is minter', async function () {
        const result = await this.token.isMinter(alice);
        
        assert.ok(result);
    });
    
    it('mint user', async function () {
        await this.token.mint(bob, 1000);
        
        const balance = await this.token.balanceOf(bob);        
        assert.equal(balance, 1000);
        
        const totalSupply = await this.token.totalSupply();
        assert.equal(totalSupply, 1000);
        
        const isuser = await this.token.users(bob);
        assert.ok(isuser);        
    });
});