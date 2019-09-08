
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const user = process.argv[2];
const address = config.users[user].address;

const tx = {
    to: config.contracts.proxyManager,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + keccak256('proxies(address)').substring(0, 8) + simpleabi.encodeValue(address)
};

(async function() {
    const result = await txs.call(host, tx);
    console.log('proxy', result);
})();

