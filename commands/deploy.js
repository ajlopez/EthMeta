
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const fs = require('fs');

const ProxyCreator = require('../build/contracts/ProxyCreator.json');

const config = require('./config.json');

const host = rskapi.host(config.host);

const tx = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: ProxyCreator.bytecode
};

(async function() {
    const txh = await txs.send(host, config.account, tx);
    console.log('transaction', txh);
    const txr = await txs.receipt(host, txh);
    console.dir(txr);
    config.proxyCreator = txr.contractAddress;
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
})();

