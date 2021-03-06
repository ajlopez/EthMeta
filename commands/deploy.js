
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const from = process.argv[2];
const name = process.argv[3];
const contractname = process.argv[4];
let args = utils.getArguments(config, process.argv[5]);

const contract = require('../build/contracts/' + contractname + '.json');

const sender = utils.getAccount(config, from);

const client = rskapi.client(config.host);

(async function() {
    try {
        const txh = await client.deploy(sender, contract.bytecode, args);
        console.log('transaction', txh);
        const txr = await client.receipt(txh, 0);
        
        if (txr)
            console.log('address', txr.contractAddress);
        
        config.instances[name] = {
            address: txr.contractAddress,
            contract: contractname
        };
        
        utils.saveConfiguration('./config.json', config);
        
        console.log('done');
    }
    catch (ex) {
        console.log(ex);
    }
})();

