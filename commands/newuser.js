
const rskapi = require('rskapi');
const txs = require('./lib/txs');
const keccak256 = require('./lib/sha3').keccak_256;

const config = require('./config.json');

const host = rskapi.host(config.hos);

const user = process.argv[2];
const hash = keccak256(user);


