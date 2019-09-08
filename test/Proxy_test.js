
const Proxy = artifacts.require('./Proxy.sol');
const Counter = artifacts.require('./Counter.sol');

const ethutils = require('ethereumjs-util');

const expectThrow = require('./utils').expectThrow;

const incrementHash = '0xd09de08a';

const accountToUse = {
    "privateKey": "0xbab84b68cbb03665aeb1c937ed231fea1699277b031e98137a3b0f2f0ee0ee8e",
    "publicKey": "0xa81f117ab3efbe3a0310c5bac3b8909af8518b2e74a96886ad777bfbfbee07f898fd058c426478bca01af34092f2abc6f0863b20151c4004adcb6c00281189e0",
    "address": "0x3c256064cd279af058c16f0bfdc67233989a7343"
};

const anotherAccount = {
    "privateKey": "0xa17fb59f38e97c973f75b23a3b23744186f8f235a58d6b86ca896f21ac843c01",
    "publicKey": "0xb76b222b4b3d344d0d8ac9f9a8e106e5da02c9471080b70c6c07001ae111fc0bfc4f36b607e1dfeaefa3ca338f2555934d9665cf418cb2a962a7b4ff9eb704bf",
    "address": "0x42487cbfd40521b6d227a1cd23830e02c8080619"
};

contract('Proxy', function (accounts) {
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];
       
    beforeEach(async function () {
        this.proxy = await Proxy.new(accountToUse.address);
        this.counter = await Counter.new();
    });    
   
    it('invoke counter increment', async function () {
        const data = incrementHash;
        const messageHash = await this.proxy.getMessageHash(this.counter.address, 0, data);

        // https://ethereum.stackexchange.com/questions/44735/sign-data-with-private-key-inside-a-truffle-test-file?rq=1
        
        const signature = ethutils.ecsign(new Buffer(messageHash.substring(2), 'hex'), new Buffer(accountToUse.privateKey.substring(2), 'hex'));
        const rpcsig = ethutils.toRpcSig(signature.v, signature.r, signature.s);
        
        await this.proxy.forward(rpcsig, this.counter.address, 0, data);
        
        const result = (await this.counter.counter()).toNumber();
        
        assert.equal(result, 1);
    });
    
    it('only appropiate signature could invoke forward', async function () {
        const data = incrementHash;
        const messageHash = await this.proxy.getMessageHash(this.counter.address, 1, data);
        
        const signature = ethutils.ecsign(new Buffer(messageHash.substring(2), 'hex'), new Buffer(accountToUse.privateKey.substring(2), 'hex'));
        const rpcsig = ethutils.toRpcSig(signature.v, signature.r, signature.s);
        
        await expectThrow(this.proxy.forward(rpcsig, this.counter.address, 0, data));
        
        const result = (await this.counter.counter()).toNumber();
        
        assert.equal(result, 0);
    });
    
    it('only original user could invoke forward', async function () {
        const data = incrementHash;
        const messageHash = await this.proxy.getMessageHash(this.counter.address, 0, data);
        
        const signature = ethutils.ecsign(new Buffer(messageHash.substring(2), 'hex'), new Buffer(anotherAccount.privateKey.substring(2), 'hex'));
        const rpcsig = ethutils.toRpcSig(signature.v, signature.r, signature.s);
        
        await expectThrow(this.proxy.forward(rpcsig, this.counter.address, 0, data));
        
        const result = (await this.counter.counter()).toNumber();
        
        assert.equal(result, 0);
    });
});

