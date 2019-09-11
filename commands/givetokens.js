
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');
const txs = require('./lib/txs');
const utils = require('./lib/utils');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.host);

const user = process.argv[2];
const address = config.users[user].address;
const amount = parseInt(process.argv[3]);

const tx = {
    to: config.contracts.proxyManager,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: '0x' + simpleabi.encodeCall('proxies(address)', [ address ])
};

const tx2 = {
    to: config.contracts.token,
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
};

(async function() {
    const result = await txs.call(host, tx);
    console.log('proxy', result);
    
    tx2.data = '0x' + simpleabi.encodeCall('mint(address,uint256)', [ result, amount ]);

    console.dir(tx2);
    
    const tx2h = await txs.send(host, config.account, tx2);
    console.log('transaction', tx2h);
    const tx2r = await txs.receipt(host, tx2h);

    if (parseInt(tx2r.status))
        console.log('done');
    else
        console.log('failed');
})();

