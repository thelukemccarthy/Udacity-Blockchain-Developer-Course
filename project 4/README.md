# Blockchain API Read Me 

### Requirements
Node.js 7.10 or higher is required to run the blockchainAPI. You download Node.js from [https://nodejs.org/en/download]

### Install
Checkout the code from [https://github.com/thelukemccarthy/Udacity-Blockchain-Developer-Course/tree/master/project%203](github.com)

``` $ git clone git@github.com:thelukemccarthy/Udacity-Blockchain-Developer-Course.git ```

Then change into the API directory

``` $ cd ./project \4 ```

run the API

``` $ npm install ```

### API Framework Used
The ExpressJS framework was used to build the API. Documentation can be found at [https://expressjs.com/en/4x/api.html]()

### Running the Unit Test
``` npm run test ```

### Running the API
``` $ node ./blockchainApi.js ```

### Testing the API is running 
While the API is running, open your browser and navigate to [http://localhost:8000/block/0](http://localhost:8000/block/0)

### API endpoints
base uri [http://localhost:8000](http://localhost:8000)

##### HTTP GET
  To get a block from the blockchain use a HTTP Get request at  
 /block/**block-heigh**   
 where **block-heigh** is the zero based index of the blockchain item you wish to have returned
 
 The block will be returned as a json object  
 for example
 ```
  {
    "hash":"cfd6d4f9252f8759a1cd51a9af1e6f5e72b2fb3ad84b8722fdc00748f73f57c1",
    "height":0,
    "body":"First block in the chain - Genesis block",
    "time":"1535273273",
    "previousBlockHash":""
  }
```

  If the block request can not be found a HTTP status of 404 is returned and the following json object
```
{
  "hash": "",
  "height" :-1,
  "body": "",
  "time": "",
  "previousBlockHash": "",
  "error": "404 Block 1 not found!"
}
```
  
##### HTTP POST
  To add a new block onto the blockchain, post a json object with a body field to  
/block

Example block
```
{
  "body": "Second block in the chain"
}
```   