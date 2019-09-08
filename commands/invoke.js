
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const ethutils = require('ethereumjs-util');
const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const user = process.argv[2];
const address = config.users[user].address;
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

const tx0 = {
    to: config.contracts.proxyManager,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + keccak256('proxies(address)').substring(0, 8) + simpleabi.encodeValue(address)
};

(async function() {
    try {
        const proxy = await txs.call(host, tx0);
        console.log('proxy', proxy);

        const tx1 = {
            to: '0x' + proxy.substring(proxy.length - 40),
            value: 0,
            gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
            gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
            data: '0x' + simpleabi.encodeCall('getMessageHash(address,uint256,bytes)', [contract, 0, args])
        };
        
        const msghash = await txs.call(host, tx1);
        console.log('msghash', msghash);
        
        const signature = ethutils.ecsign(new Buffer(msghash.substring(2), 'hex'), new Buffer(config.users[user].privateKey.substring(2), 'hex'));
        const rpcsig = ethutils.toRpcSig(signature.v, signature.r, signature.s);
        
        console.log('signature', rpcsig);
        
        const data2 = simpleabi.encodeCall('forward(bytes,address,uint256,bytes)', [ rpcsig, contract, 0, args ]);

        const tx = {
            to: '0x' + proxy.substring(proxy.length - 40),
            value: 0,
            gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
            gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
            data: '0x' + data2
        };

        const txh = await txs.send(host, config.account, tx);
        console.log('transaction', txh);
        const txr = await txs.receipt(host, txh);

        if (parseInt(txr.status))
            console.log('done');
        else
            console.log('failed');
    }
    catch (ex) {
        console.log(ex);
    }
})();


