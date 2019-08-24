
const Proxy = artifacts.require('./Proxy.sol');
const Counter = artifacts.require('./Counter.sol');

const expectThrow = require('./utils').expectThrow;

const incrementHash = '0xd09de08a';

contract('Proxy', function (accounts) {
    beforeEach(async function () {
        this.proxy = await Proxy.new();
        this.counter = await Counter.new();
    });    
   
    it('invoke counter increment', async function () {
        const data = incrementHash;
        
        await this.proxy.forward(this.counter.address, 0, data);
        
        const result = (await this.counter.counter()).toNumber();
        
        assert.equal(result, 1);
    });
    
    it('only whitelisted account could invoke forward', async function () {
        const data = incrementHash;
        
        await expectThrow(this.proxy.forward(this.counter.address, 0, data, { from: accounts[1] }));
        
        const result = (await this.counter.counter()).toNumber();
        
        assert.equal(result, 0);
    });
    
    it('whitelist account', async function () {
        await this.proxy.setWhitelist(accounts[1], true);
        
        const data = incrementHash;
        
        await this.proxy.forward(this.counter.address, 0, data, { from: accounts[1] });
        
        const result = (await this.counter.counter()).toNumber();
        
        assert.equal(result, 1);
    });
    
    it('only whitelisted account could invoke whitelist account', async function () {
        await expectThrow(this.proxy.setWhitelist(accounts[1], true, { from: accounts[2] }));
        
        const result = await this.proxy.whitelist(accounts[1]);
        
        assert.equal(result, false);
    });
});

