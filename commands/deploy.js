
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const fs = require('fs');
const simpleabi = require('simpleabi');

const ProxyManager = require('../build/contracts/ProxyManager.json');
const Counter = require('../build/contracts/Counter.json');
const UtilityToken = require('../build/contracts/UtilityToken.json');
const Game = require('../build/contracts/Game.json');

const config = require('./config.json');

if (!config.contracts)
    config.contracts = {};

const host = rskapi.host(config.host);

const tx = {
    value: 0,
    gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
    gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
    data: ProxyManager.bytecode
};

const tx2 = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: Counter.bytecode
};

const tx3 = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: UtilityToken.bytecode
};

const tx4 = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000,
    data: Game.bytecode
};

const tx5 = {
    value: 0,
    gas: 5000000,
    gasPrice: 60000000
};

(async function() {
    try {
        const txh = await txs.send(host, config.account, tx);
        console.log('transaction', txh);
        const txr = await txs.receipt(host, txh);
        config.contracts.proxyManager = txr.contractAddress;
        console.log('ProxyManager at', config.contracts.proxyManager);
        
        const tx2h = await txs.send(host, config.account, tx2);
        console.log('transaction', tx2h);
        const tx2r = await txs.receipt(host, tx2h);
        config.contracts.counter = tx2r.contractAddress;
        console.log('Counter at', config.contracts.counter);
        
        const tx3h = await txs.send(host, config.account, tx3);
        console.log('transaction', tx3h);
        const tx3r = await txs.receipt(host, tx3h);
        config.contracts.token = tx3r.contractAddress;
        console.log('UtilityToken at', config.contracts.token);
        
        tx4.data += simpleabi.encodeValue(tx3r.contractAddress);
        const tx4h = await txs.send(host, config.account, tx4);
        console.log('transaction', tx4h);
        const tx4r = await txs.receipt(host, tx4h);
        config.contracts.game = tx4r.contractAddress;
        console.log('Game at', config.contracts.game);

        tx5.to = config.contracts.token;
        tx5.data = '0x' + simpleabi.encodeCall('addPayer(address)', [ config.contracts.game ]);
        
        const tx5h = await txs.send(host, config.account, tx5);
        console.log('transaction', tx5h);
        const tx5r = await txs.receipt(host, tx5h);
        
        if (parseInt(tx5r.status))
            console.log('Game', config.contracts.game,'is payer of', config.contracts.token);
        else
            console.log('failed');
        
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    } catch (ex) {
        console.log(ex);
    }
})();

