
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const user = process.argv[2];
const hash = keccak256(user);

console.log(hash);

const tx = {
    to: config.contracts.proxyCreator,
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: '0x' + keccak256('createProxy(bytes32)').substring(0, 8) + hash
};

(async function() {
    const txh = await txs.send(host, config.account, tx);
    console.log('transaction', txh);
    const txr = await txs.receipt(host, txh);
    console.log('done');
})();

