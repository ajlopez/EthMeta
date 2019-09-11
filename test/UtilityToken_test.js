
const UtilityToken = artifacts.require('./UtilityToken.sol');

const expectThrow = require('./utils').expectThrow;

contract('UtilityToken', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];
    
    beforeEach(async function() {
        this.token = await UtilityToken.new();
    });
    
    it('creator is minter', async function () {
        const result = await this.token.isMinter(alice);
        
        assert.ok(result);
    });
    
    it('creator is payer', async function () {
        const result = await this.token.isMinter(alice);
        
        assert.ok(result);
    });
    
    it('add payer', async function () {
        await this.token.addPayer(charlie);
        
        const result = this.token.isPayer(charlie);
        
        assert.ok(result);
    });
    
    it('non payer cannot add payer', async function () {
        await expectThrow(this.token.addPayer(charlie, { from: bob }));
    });
    
    it('creator is not user', async function () {
        const result = await this.token.users(alice);
        
        assert.ok(!result);
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

