
const simpleabi = require('simpleabi');

const txs = require('./txs');

async function getUserProxyAddress(host, config, user) {
    return await call(host, config, config.contracts.proxyManager, 'proxies(address)', [ config.users[user]. address ]);
}

async function processArgument(host, config, arg) {
    if (config.users && config.users[arg])
        return getUserProxyAddress(host, config, arg);
    
    if (config.contracts && config.contracts[arg])
        return config.contracts[arg];
    
    if (config.accounts && config.accounts[arg])
        if (config.accounts[arg].address)
            return config.accounts[arg].address;
        else
            return config.accounts[arg];
        
    if (arg === 'relayer')
        if (config.account.address)
            return config.account.address;
        else
            return config.account;
        
    return arg;
}

async function processArguments(host, config, args) {
    if (!args)
        return null;
    
    if (typeof args === 'string')
        args = args.split(';');
    
    for (let k = 0, l = args.length; k < l; k++)
        args[k] = await processArgument(host, config, args[k]);
    
    return args;
}

async function call(host, config, contract, fn, args) {
    args = await processArguments(host, config, args);
    
    if (config.contracts && config.contracts[contract])
        contract = config.contracts[contract];
    
    const tx = {
        to: contract,
        value: 0,
        gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
        gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
        data: '0x' + simpleabi.encodeCall(fn, args)
    };

    return await txs.call(host, tx);
}

async function invoke(host, config, sender, contract, fn, args) {
    args = await processArguments(host, config, args);
    
    if (config.contracts && config.contracts[contract])
        contract = config.contracts[contract];
    
    if (config.accounts && config.accounts[sender])
        sender = config.accounts[sender];
    
    const tx = {
        to: contract,
        value: 0,
        gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
        gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
        data: '0x' + simpleabi.encodeCall(fn, args)
    };
    
    const txh = await txs.send(host, sender, tx);
    
    console.log('transaction', txh);
    
    const txr = await txs.receipt(host, txh);
    
    if (txr && parseInt(txr.status)) {
        console.log('done');
        return true;
    }
    else {
        console.log('failed');
        return false;
    }
}

async function deploy(host, config, sender, contractname, instancename, args) {
    const bytecode = require('../../build/contracts/' + contractname + '.json').bytecode;
    args = await processArguments(host, config, args);
    let data = bytecode;
    
    if (args)
        data += simpleabi.encodeValues(args);
    
    if (config.accounts && config.accounts[sender])
        sender = config.accounts[sender];
    
    const tx = {
        gas: config.options && config.options.gas != null ? config.options.gas : 5000000,
        gasPrice: config.options && config.options.gasPrice != null ? config.options.gasPrice :60000000,
        data: data
    };
    
    const txh = await txs.send(host, sender, tx);
    
    console.log('transaction', txh);
    
    const txr = await txs.receipt(host, txh);
    
    if (txr && parseInt(txr.status)) {
        config.contracts[instancename] = txr.contractAddress;
        console.log(contractname, 'deployed at', txr.contractAddress);
    }
    else
        console.log('failed');
}

module.exports = {
    deploy: deploy,
    call: call,
    invoke: invoke,
    arguments: processArguments
};

