
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const fs = require('fs');

const ProxyCreator = require('../build/contracts/ProxyCreator.json');
const Counter = require('../build/contracts/Counter.json');

const config = require('./config.json');

if (!config.contracts)
    config.contracts = {};

const host = rskapi.host(config.host);

const tx = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: ProxyCreator.bytecode
};

const tx2 = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: Counter.bytecode
};

(async function() {
    const txh = await txs.send(host, config.account, tx);
    console.log('transaction', txh);
    const txr = await txs.receipt(host, txh);
    config.contracts.proxyCreator = txr.contractAddress;
    console.log('ProxyCreator at', config.contracts.proxyCreator);
    
    const tx2h = await txs.send(host, config.account, tx2);
    console.log('transaction', tx2h);
    const tx2r = await txs.receipt(host, tx2h);
    config.contracts.counter = tx2r.contractAddress;
    console.log('Counter at', config.contracts.counter);
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
})();

