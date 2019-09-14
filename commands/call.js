
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const commands = require('./lib/commands');
const utils = require('./lib/utils');

const config = require('./config.json');

const host = rskapi.host(config.host);

const contract = process.argv[2];
const fn = process.argv[3];
let args = process.argv[4];

(async function() {
    try {
        const result = await commands.call(host, config, contract, fn, args);
        console.log('result', result);
    }
    catch (ex) {
        console.log(ex);
    }
})();

