# Decentralized Star Notary

### Requirements
* Node v8.10.0 or above  
* Truffle v4.1.14
* Ganache v1.2.2
  
### Setup  
* npm install

### Running the tests
* Open Ganache
* from the directory './project 5/smart_contracts' run the command ``` npm run test ```     

### Deployment to Rinkeby test network
Setup two environment variables to store 
* ``` WALLET_MNEMONIC ``` to store your wallet key phrase
* ``` INFURA_URL ``` to store your infura url

* from the directory './project 5/smart_contracts' run the command ``` truffle deploy --network rinkeby ``` 

#### Example output
```
Compiling ./contracts/StarNotary.sol...
Compiling openzeppelin-solidity/contracts/introspection/ERC165.sol...
Compiling openzeppelin-solidity/contracts/introspection/IERC165.sol...
Compiling openzeppelin-solidity/contracts/math/SafeMath.sol...
Compiling openzeppelin-solidity/contracts/token/ERC721/ERC721.sol...
Compiling openzeppelin-solidity/contracts/token/ERC721/IERC721.sol...
Compiling openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol...
Compiling openzeppelin-solidity/contracts/utils/Address.sol...
Writing artifacts to ./build/contracts

Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x5d832814bf3020a5da2e5daa341d4358c1b64455f7d733b4b749942206ddd7c1
  Migrations: 0x4cf998e88b6f0d4210d99d2e9d74c93171c88d3b
Saving successful migration to network...
  ... 0x81cf35418c98157128667fa90abf768ecb6d94ed4d0fd0b2e18c68ebdd976eca
Saving artifacts...
Running migration: 2_star_notary_migration.js
  Deploying StarNotary...
  ... 0x1fff7a42d02da359d1e6b67781fee43ffbc40e7c1e5cd6651c402770c84c59f0
  StarNotary: 0xacc140e8d8fa322a96c63478ca8329a7260e7e46
Saving successful migration to network...
  ... 0xfa182a642c32a0954e07d26819b5a3ffa6fdcc27d17ff9a3d26f94d103403d44
Saving artifacts...
```
### Transaction details
#### Contract
TX Hash: 0x1fff7a42d02da359d1e6b67781fee43ffbc40e7c1e5cd6651c402770c84c59f0  

#### Create Star
Star Token ID: 1  
TX Hash: 0xe69390fc58b0f049c3ac37af0dd886b6b7d6081b93cb5179f8db00d5a856c595  

#### Put Star Up For Sale
Star Token ID: 1  
TX Hash: 0x91657fdcc5792fc22dcecf64e75ada1c73b2c07f6d73b764be79ebdb4e150627
