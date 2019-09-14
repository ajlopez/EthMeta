
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const commands = require('./lib/commands');
const ethutils = require('ethereumjs-util');
const simpleabi = require('simpleabi');

const config = require('./config.json');

const host = rskapi.host(config.host);

const user = process.argv[2];
let contract = process.argv[3];
const fn = process.argv[4];
let args = process.argv[5];

(async function() {
    try {
        if (config.users[user]) {
            args = simpleabi.encodeCall(fn, await commands.arguments(host, config, args));
            
            let proxy = await commands.call(host, config, 'proxyManager', 'proxies(address)', [ config.users[user].address ]);
            proxy = '0x' + proxy.substring(proxy.length - 40);
            console.log('proxy', proxy);

            const msghash = await commands.call(host, config, proxy, 'getMessageHash(address,uint256,bytes)', [contract, 0, args]);
            console.log('msghash', msghash);
            
            const signature = ethutils.ecsign(new Buffer(msghash.substring(2), 'hex'), new Buffer(config.users[user].privateKey.substring(2), 'hex'));
            const rpcsig = ethutils.toRpcSig(signature.v, signature.r, signature.s);
            
            console.log('signature', rpcsig);
            
            await commands.invoke(host, config, 'root', proxy, 'forward(bytes,address,uint256,bytes)', [ rpcsig, contract, 0, args ]);
        }
        else
            await commands.invoke(host, config, user, contract, fn, args);
    }
    catch (ex) {
        console.log(ex);
    }
})();


