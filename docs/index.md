# aipgcore v1.0.3

## Principles

aipgcoin is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the aipgcoin network allows for highly resilient aipgcoin infrastructure, and the developer community needs reliable, open-source tools to implement aipgcoin apps and services. aipgcore provides a reliable API for JavaScript apps that need to interface with aipgcoin.

To get started, just `npm install aipgcore` or `bower install aipgcore`.

# Documentation Index

## Addresses and Key Management

* [Addresses](address.md)
* [Using Different Networks](networks.md)
* [Private Keys](privatekey.md) and [Public Keys](publickey.md)
* [Hierarchically-derived Private and Public Keys](hierarchical.md)

## Payment Handling
* [Using Different Units](unit.md)
* [Acknowledging and Requesting Payments: aipgcoin URIs](uri.md)
* [The Transaction Class](transaction.md)

## aipgcoin Internals
* [Scripts](script.md)
* [Block](block.md)

## Extra
* [Crypto](crypto.md)
* [Encoding](encoding.md)

## Module Development
* [Browser Builds](browser.md)

## Modules

Some functionality is implemented as a module that can be installed separately:

* [Payment Protocol Support](https://github.com/AIPowerGrid/aipgcore-payment-protocol)
* [Peer to Peer Networking](https://github.com/AIPowerGrid/aipgcore-p2p)
* [aipgcoin Core JSON-RPC](https://github.com/underdarkskies/aipgd-rpc)
* [Payment Channels](https://github.com/AIPowerGrid/aipgcore-channel)
* [Mnemonics](https://github.com/AIPowerGrid/aipgcore-mnemonic)
* [Elliptical Curve Integrated Encryption Scheme](https://github.com/AIPowerGrid/aipgcore-ecies)
* [Blockchain Explorers](https://github.com/AIPowerGrid/aipgcore-explorers)
* [Signed Messages](https://github.com/AIPowerGrid/aipgcore-message)

# Examples

## Create and Save a Private Key

```javascript
var privateKey = new aipgcore.PrivateKey();

var exported = privateKey.toWIF();
// e.g. L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m
var imported = aipgcore.PrivateKey.fromWIF(exported);
var hexa = privateKey.toString();
// e.g. 'b9de6e778fe92aa7edb69395556f843f1dce0448350112e14906efc2a80fa61a'
```

## Create an Address

```javascript
var address = privateKey.toAddress();
```

## Create a Multisig Address

```javascript
// Build a 2-of-3 address from public keys
var p2shAddress = new aipgcore.Address([publicKey1, publicKey2, publicKey3], 2);
```

## Request a Payment

```javascript
var paymentInfo = {
  address: '1DNtTk4PUCGAdiNETAzQFWZiy2fCHtGnPx',
  amount: 120000 //satoshis
};
var uri = new aipgcore.URI(paymentInfo).toString();
```

## Create a Transaction

```javascript
var transaction = new Transaction()
    .from(utxos)          // Feed information about what unspent outputs one can use
    .to(address, amount)  // Add an output with the given amount of satoshis
    .change(address)      // Sets up a change address where the rest of the funds will go
    .sign(privkeySet)     // Signs all the inputs it can
```

## Connect to the Network

```javascript
var peer = new Peer('5.9.85.34');

peer.on('inv', function(message) {
  // new inventory
});

peer.connect();
```
