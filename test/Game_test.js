
const UtilityToken = artifacts.require('./UtilityToken.sol');
const Game = artifacts.require('./Game.sol');
const User = artifacts.require('./User.sol');

const expectThrow = require('./utils').expectThrow;

contract('Game', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];

    beforeEach(async function() {
        this.token = await UtilityToken.new('Utility Token', 'UTI');
        this.game = await Game.new(this.token.address);
        
        // TODO payer role
        //await this.token.addPayer(this.game.address);
        
        this.user = await User.new(this.game.address);
    });

    it('user can play', async function () {
        await this.token.mint(this.user.address, 1000);
        await this.user.play(1, 2);
        
        const result = await this.game.owners(1, 2);
        assert.equal(result, this.user.address);
        
        const balance1 = await this.token.balanceOf(this.user.address);
        assert.equal(balance1.toNumber(), 990);
        
        const balance2 = await this.token.balanceOf(alice);
        assert.equal(balance2.toNumber(), 10);
    });
    
    it('user cannot play without enough tokens', async function () {
        await this.token.mint(this.user.address, 5);
        await expectThrow(this.user.play(1, 2));
        
        const result = await this.game.owners(1, 2);
        assert.equal(result, 0);
        
        const balance1 = await this.token.balanceOf(this.user.address);
        assert.equal(balance1.toNumber(), 5);
        
        const balance2 = await this.token.balanceOf(alice);
        assert.equal(balance2.toNumber(), 0);
    });
});

