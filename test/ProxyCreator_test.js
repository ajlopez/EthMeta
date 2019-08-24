
const ProxyCreator = artifacts.require('./ProxyCreator.sol');

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
    });
});

