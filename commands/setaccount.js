
const rskapi = require('rskapi');

const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

const host = rskapi.host(config.host);

(async function() {
    const accounts = await host.getAccounts();
    config.account = accounts[0];
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
})();

