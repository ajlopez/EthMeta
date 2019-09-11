
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const txs = require('./lib/txs');
const utils = require('./lib/utils');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const contract = process.argv[2];
const fn = process.argv[3];
let args = process.argv[4];

if (args) {
    args = args.split(';');

    for (let k in args)
        args[k] = utils.getAddress(config, args[k]);
}

const tx = {
    to: config.contracts[contract] ? config.contracts[contract] : contract,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + simpleabi.encodeCall(fn, args)
};

(async function() {
    try {
        const result = await txs.call(host, tx);
        console.log('result', result);
    }
    catch (ex) {
        console.log(ex);
    }
})();

