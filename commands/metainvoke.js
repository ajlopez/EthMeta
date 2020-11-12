
const utils = require('./lib/utils');
const rskapi = utils.rskapi;
const ethutils = require('ethereumjs-util');

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

const from = utils.getAccount(config, process.argv[2]);
const sponsor = utils.getAccount(config, process.argv[3]);
const to = utils.getInstanceAddress(config, process.argv[4]);
const fn = process.argv[5];
let args = utils.getArguments(config, process.argv[6]);

(async function() {
    try {
        const metaargs = '0x' + rskapi.utils.encodeCall(fn, args);
        const proxyManager = utils.getInstanceAddress(config, 'proxyManager');
        console.log('proxy manager', proxyManager);
        console.log('from', from.address);
        
        let proxy = await client.call(sponsor, proxyManager, 'proxies(address)', utils.getArguments(config, process.argv[2]));
        
        if (proxy.length >= 64)
            proxy = '0x' + proxy.substring(proxy.length - 40);
        
        console.log('proxy', proxy);

        const msghash = await client.call(sponsor, proxy, 'getMessageHash(address,uint256,bytes)', [to, 0, metaargs]);
        console.log('msghash', msghash);

        const signature = ethutils.ecsign(Buffer.from(msghash.substring(2), 'hex'), Buffer.from(from.privateKey.substring(2), 'hex'));
        const rpcsig = ethutils.toRpcSig(signature.v, signature.r, signature.s);
        
        console.log('signature', rpcsig);

        const txh = await client.invoke(sponsor, proxy, 'forward(bytes,address,uint256,bytes)', [ rpcsig, to, 0, metaargs ]);
        console.log('transaction', txh);
        const txr = await client.receipt(txh, 0);
        console.log(txr && parseInt(txr.status) ? 'done' : 'failed');
    }
    catch (ex) {
        console.log(ex);
    }
})();

