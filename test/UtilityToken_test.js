
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
        const result = await this.token.isPayer(alice);
        
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
    
    it('pay from user to account', async function () {
        await this.token.mint(bob, 1000);
        await this.token.pay(bob, charlie, 400);
        
        const balance1 = await this.token.balanceOf(bob);
        assert.equal(balance1, 600);
        
        const balance2 = await this.token.balanceOf(charlie);
        assert.equal(balance2, 400);
    });    
    
    it('cannot pay using non user', async function () {
        await this.token.mint(bob, 1000);
        await this.token.pay(bob, charlie, 400);
        await expectThrow(this.token.pay(charlie, alice, 200));
        
        const balance1 = await this.token.balanceOf(bob);
        assert.equal(balance1, 600);
        
        const balance2 = await this.token.balanceOf(charlie);
        assert.equal(balance2, 400);
    });    
    
    it('non payer cannot pay', async function () {
        await this.token.mint(bob, 1000);
        await expectThrow(this.token.pay(bob, charlie, 400, { from: charlie }));
        
        const balance1 = await this.token.balanceOf(bob);
        assert.equal(balance1, 1000);
        
        const balance2 = await this.token.balanceOf(charlie);
        assert.equal(balance2, 0);
    });    
    
    it('user cannot transfer tokens', async function () {
        await this.token.mint(bob, 1000);

        assert.ok(await this.token.users(bob));
        
        await expectThrow(this.token.transfer(charlie, 400, { from: bob }));
        await expectThrow(this.token.approve(charlie, 400, { from: bob }));
        
        const balance1 = await this.token.balanceOf(bob);
        assert.equal(balance1, 1000);
        
        const balance2 = await this.token.balanceOf(charlie);
        assert.equal(balance2, 0);
    });    
});

