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
node genaccount root
```

Then, fund the account. In RSK testnet, you can use (https://faucet.rsk.co/)[https://faucet.rsk.co/].

Deploy `Counter` and `ProxyManager` contracts using `root` account:

```
node deploy root counter Counter
node deploy root proxyManager ProxyManager
```
They names are 'proxyManager' and 'counter', respectively.

Create a new user:

```
node genaccount alice
```

A proxy contract is deployed to be used as the user identity. You can retrieve
the proxy contract address running:

```
node invoke root proxyManager createProxy(address) alice
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
node metainvoke alice root counter add(uint256) 42
```

These transactions are invoked using the proxy contract assigned to the
specified user `alice`. The transaction is send by `root`.

You can check the new counter value running:
```
node call counter counter()
```

## To be done

- More contract examples to be deployed and invoked (ie, an ERC20 token, a game)
- Using tokens to pay sponsorship




