
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const user = process.argv[2];
let contract = process.argv[3];
const fn = process.argv[4];
let args = process.argv[5];

function isNumber(text) {
    const digit = text[0];
    
    return digit >= '0' && digit <= '9' && text.substring(0,2).toLowerCase() !== '0x';
}

if (args)
    args = args.split(';');

args = simpleabi.encodeCall(fn, args);

if (config.contracts[contract])
    contract = config.contracts[contract];

let data = simpleabi.encodeValues([contract, 0, 32 * 3]);
const largs = args.length / 2;

while (args.length % 64)
    args += '00';

data += simpleabi.encodeValue(largs) + args;

const hash = keccak256(user);

const tx0 = {
    to: config.contracts.proxyCreator,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + keccak256('proxies(bytes32)').substring(0, 8) + hash
};

const tx = {
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + keccak256('forward(address,uint256,bytes)').substring(0, 8) + data
};

(async function() {
    const address = await txs.call(host, tx0);
    console.log('proxy', address);
    tx.to = '0x' + address.substring(address.length - 40);
    const txh = await txs.send(host, config.account, tx);
    console.log('transaction', txh);
    const txr = await txs.receipt(host, txh);
    console.log('done');
})();


