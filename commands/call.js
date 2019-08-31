
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const contract = process.argv[2];
const fn = process.argv[3];
let args = process.argv[3];

if (args) {
    args = args.split(';');
    args = simpleabi.encodeValues(args);
}

const tx = {
    to: config.contracts[contract] ? config.contracts[contract] : contract,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + keccak256(fn).substring(0, 8) + (args ? args : '')
};

(async function() {
    const result = await txs.call(host, tx);
    console.log('result', result);
})();

