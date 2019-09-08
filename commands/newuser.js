
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const fs = require('fs');

const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;
const utils = require('./lib/utils');

const config = require('./config.json');

if (!config.users)
    config.users = {};

const host = rskapi.host(config.host);

const user = process.argv[2];
const account = utils.generateAddress();

const tx = {
    to: config.contracts.proxyManager,
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: '0x' + keccak256('createProxy(address)').substring(0, 8) + simpleabi.encodeValue(account.address)
};

(async function() {
    try {
        const txh = await txs.send(host, config.account, tx);
        console.log('transaction', txh);
        const txr = await txs.receipt(host, txh);
        config.users[user] = account;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
        console.log('done');
    }
    catch (ex) {
        console.log(ex);
    }
})();

