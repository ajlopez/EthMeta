
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const fs = require('fs');

const ProxyManager = require('../build/contracts/ProxyManager.json');
const Counter = require('../build/contracts/Counter.json');

const config = require('./config.json');

if (!config.contracts)
    config.contracts = {};

const host = rskapi.host(config.host);

const tx = {
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: ProxyManager.bytecode
};

const tx2 = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: Counter.bytecode
};

(async function() {
    try {
    const txh = await txs.send(host, config.account, tx);
    console.log('transaction', txh);
    const txr = await txs.receipt(host, txh);
    config.contracts.proxyManager = txr.contractAddress;
    console.log('ProxyManager at', config.contracts.proxyManager);
    
    const tx2h = await txs.send(host, config.account, tx2);
    console.log('transaction', tx2h);
    const tx2r = await txs.receipt(host, tx2h);
    config.contracts.counter = tx2r.contractAddress;
    console.log('Counter at', config.contracts.counter);
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    } catch (ex) {
        console.log(ex);
    }
})();

