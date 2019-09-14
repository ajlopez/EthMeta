
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const commands = require('./lib/commands');
const fs = require('fs');
const simpleabi = require('simpleabi');

const config = require('./config.json');

if (!config.contracts)
    config.contracts = {};

const host = rskapi.host(config.host);

(async function() {
    try {
        await commands.deploy(host, config, 'ProxyManager', 'proxyManager');
        await commands.deploy(host, config, 'Counter', 'counter');
        await commands.deploy(host, config, 'Game', 'game');
        await commands.deploy(host, config, 'UtilityToken', 'utoken');
        const result = await commands.invoke(host, config, 'utoken', 'addPayer(address)', [ 'game' ]);
        
        if (result)
            console.log('game is payer of utoken');
        
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    } catch (ex) {
        console.log(ex);
    }
})();

