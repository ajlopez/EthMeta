
const rskapi = require('rskapi');

const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

if (!config.accounts)
    config.accounts = {};

const host = rskapi.host(config.host);
const name = process.argv[2];
const address = process.argv[3];

(async function() {
    const accounts = await host.getAccounts();
    let account;
    
    if (address && address.length <= 2)
        account = accounts[parseInt(address)];
    else if (!address)
        account = accounts[0];
    else
        account = address;
    
    config.accounts[name] = account;
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
})();

