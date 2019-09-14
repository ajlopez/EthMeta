# Commands

Simple quick commands to create user proxy contracts, invoke and call contracts.

Install the node dependencies:

```
npm install
```

You must compile the contracts at main project folder:

```
cd ..
truffle compile
cd commands
```

Set the host to use:

```
node sethost http://localhost:8545
```

if you are using a local `ganache-cli` node. If your are using RSK testnet
run
```
node sethost https://public-node.testnet.rsk.co:443
```
 
If you are using the local `ganache-cli` node, or RSK node in `regtest` mode, set the first account as
the account to use in deploy and other transactions, running:

```
node setaccount root
```

`root` is the name of the special account that it will be used as contract deployer and relayer.

If you are using RSK testnet or other network, create a new account:
```
node newaccount root
```

Then, fund the account. In RSK testnet, you can use (https://faucet.testnet.rsk.co)[https://faucet.testnet.rsk.co].

Deploy the `ProxyCreator`, `Counter`, `UtilityToken` and `Game` contracts:

```
node deploy
```
They names are 'proxyCreator', 'counter', 'utoken' and 'game', respectively.

Create a new user:

```
node newuser jack
```

A proxy contract is deployed to be used as the user identity. You can retrieve
the proxy contract address running:

```
node getproxy jack
```

You can call the deployed `Counter` contract instance, using:

```
node call counter counter()
```
The result is the internal counter value.

You can invoke the deployed `Counter` contract instance, running:

```
node invoke jack counter increment()
```
or
```
node invoke jack counter add(uint256) 42
```

These transactions are invoked using the proxy contract assigned to the
specified user.

You can check the new counter value running:
```
node call counter counter()
```

To invoke `Game` contract, the user should have utility tokens (each game play pays 10 utility tokens to the relayer account):
```
node invoke root utoken mint(address,uint256) alice;1000
```

To query the amount of tokens of a user:
```
node call token balanceOf(address) alice
```

To play a move to row 1, column 2
```
node invoke alice game play(uint256,uint256) 1;2
```

To query the owner of a game cell:
```
node call game owners(uint256,uint256) 1;2
```

Notice that after a game play the token balance of a user/player is decremented in 10 tokens.

## To be done

- More contract examples to be deployed and invoked (ie, an ERC20 token)


