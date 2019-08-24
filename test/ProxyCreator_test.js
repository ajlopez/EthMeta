
const ProxyCreator = artifacts.require('./ProxyCreator.sol');
const Proxy = artifacts.require('./Proxy');

contract('ProxyCreator', function (accounts) {
    beforeEach(async function () {
        this.creator = await ProxyCreator.new();
    });    
   
   it('unknown proxy', async function () {
        const result = await this.creator.proxies('0x01');
        
        assert.equal(parseInt(result), 0);
    });
    
    it('create proxy', async function () {
        await this.creator.createProxy('0x01');
        
        const result = await this.creator.proxies('0x01');
        
        assert.ok(parseInt(result) != 0);
        
        const proxy = await Proxy.at(result);
        
        const whitelisted = await proxy.whitelist(accounts[0]);
        
        assert.ok(whitelisted);
    });
});

