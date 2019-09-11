// https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address

var utils = require('ethereumjs-util');

function generateRandomHexaByte() {
    var n = Math.floor(Math.random() * 255).toString(16);
    
    while (n.length < 2)
        n = '0' + n;
    
    return n;
}

function generateRandomPrivateKey() {
    do {
        var keytxt = '';
        
        for (var k = 0; k < 32; k++)
            keytxt += generateRandomHexaByte();
        
        var key = new Buffer(keytxt, 'hex');
    }
    while (!utils.isValidPrivate(key));
    
    return key;
}

function generateAddress() {
    var privateKey = generateRandomPrivateKey();
    var publicKey = '0x' + utils.privateToPublic(privateKey).toString('hex');
    var address = '0x' + utils.privateToAddress(privateKey).toString('hex');
    
    if (!utils.isValidAddress(address))
        throw new Error('invalid address: ' + address);
    
    return {
        privateKey: '0x' + privateKey.toString('hex'),
        publicKey: publicKey,
        address: address
    }
}

function getAddress(config, user) {
    if (user.substring(0, 2).toLowerCase() === '0x')
        return user;
    
    if (!config.users)
        return user;
    
    if (config.users[user])
        if (config.users[user].address)
            return config.users[user].address;
        else
            return config.users[user];
        
    return user;
}

function getInstanceAddress(config, name) {
    if (name.substring(0, 2).toLowerCase() === '0x')
        return name;
    
    if (!config.instances)
        return name;
    
    if (config.instances[name])
        return config.instances[name].address || config.instances[name];
    
    return name;
}

function getAccount(config, user) {
    if (user.substring(0, 2).toLowerCase() === '0x')
        return user;
    
    if (!config.accounts)
        return user;
    
    if (config.accounts[user])
        return config.accounts[user];
        
    return user;
}

function getValue(value) {
    if (typeof value === 'string' && value.substring(0, 2).toLowerCase() === '0x')
        return value;
    
    return parseInt(value);
}

module.exports = {
    getAddress: getAddress,
    getInstanceAddress: getInstanceAddress,
    getAccount: getAccount,
    getValue: getValue,
    generateAddress: generateAddress
};

