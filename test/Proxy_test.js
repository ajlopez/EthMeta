
const Proxy = artifacts.require('./Proxy.sol');
const Counter = artifacts.require('./Counter.sol');

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
});

