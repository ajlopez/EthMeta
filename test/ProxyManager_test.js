
const ProxyManager = artifacts.require('./ProxyManager.sol');
const Proxy = artifacts.require('./Proxy');

const expectThrow = require('./utils').expectThrow;

contract('ProxyManager', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    
    beforeEach(async function () {
        this.manager = await ProxyManager.new();
    });    
   
   it('unknown proxy', async function () {
        const result = await this.manager.proxies(bob);
        
        assert.equal(parseInt(result), 0);
    });
    
    it('create proxy', async function () {
        await this.manager.createProxy(bob);
        
        const result = await this.manager.proxies(bob);
        
        assert.ok(parseInt(result) != 0);
        
        const proxy = await Proxy.at(result);
        
        const user = await proxy.user();
        
        assert.equal(user, bob);
    });
    
    it('cannot create proxy twice for the same user', async function () {
        await this.manager.createProxy(bob);
        await expectThrow(this.manager.createProxy(bob));
        
        const result = await this.manager.proxies(bob);
        
        assert.ok(parseInt(result) != 0);
        
        const proxy = await Proxy.at(result);
        
        const user = await proxy.user();
        
        assert.equal(user, bob);
    });
});

