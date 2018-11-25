# Blockchain API Read Me 

### Requirements
Node.js 7.10 or higher is required to run the blockchainAPI. You download Node.js from [https://nodejs.org/en/download]

### Install
Checkout the code from [https://github.com/thelukemccarthy/Udacity-Blockchain-Developer-Course/tree/master/project%204](github.com)

``` $ git clone git@github.com:thelukemccarthy/Udacity-Blockchain-Developer-Course.git ```

Then change into the API directory

``` $ cd ./project \4 ```

Install the required packages

``` $ npm install ```

### API Framework Used
The ExpressJS framework was used to build the API. Documentation can be found at [https://expressjs.com/en/4x/api.html]()

### Running the Unit Test
``` npm run test ```

### Running the API
``` $ npm start ```  
or  
``` $ node ./blockchainApi.js ```

### Testing the API is running 
While the API is running, open your browser and navigate to [http://localhost:8000/block/0](http://localhost:8000/block/0)

### API endpoints
base uri [http://localhost:8000](http://localhost:8000)

### Finding blocks on the blockchain
You can find blocks on the blockchain using one of three methods
1. Find by the block height at ``` /block/<block-height> ```
1. Find by address at ``` /stars/address:<address-value> ```
1. find by block hash at ``` /stars/hash:<hash-value> ```  

See full details for each method below

##### HTTP GET
###### Get block by block-height
  To get a block from the blockchain use a HTTP Get request at  
 /block/**block-heigh**   
 where **block-heigh** is the zero based index of the blockchain item you wish to have returned
 
 The block will be returned as a json object  
 for example
```
{
  "hash": "67633e1b2d64b7b4695ac383b83563362fabcb4a4c3f9dc25e3b1a8c542ec31b",
  "body": {
    "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
    "star": {
      "dec": "-26° 29' 24.9",
      "ra": "16h 29m 1.0s",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded":"Found star using https://www.google.com/sky/"
    }
  },
  "time": "1543113655",
  "previousBlockHash": "299fc25b3175caba2428064d676c27321cd33dac8c549560e5f2a26d34c67a79",
  "height": 1
}
```

  If the block request can not be found a HTTP status of 404 is returned and the following json object
```
{
  "hash": "",
  "height" :-1,
  "body": {
    "address":"",
    "star":{
      "dec":"",
      "ra":"",
      "story":""
    }
  },
  "time": -1,
  "previousBlockHash": "",
  "error": "404 Block 1 not found!"
}
```

###### Get block by address in block
  To get a block from the blockchain use a HTTP Get request at  
 /stars/address:**address**   
 where **address** is the address used to register the star
 
 An array of blocks will be returned  for all stars that were registered using the provided address  
 for example
 ```
[  
  {  
    "hash":"5e95933daa1ba1abce42c3a0dab9bc7cd57899ec2e0b65506df673b28c1e5e16",
    "body":{  
      "address":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
      "star":{  
        "dec":"-26° 29' 24.9",
        "ra":"16h 29m 1.0s",
        "story":"5374617220312c20466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded":"Star 1, Found star using https://www.google.com/sky/"
      }
    },
    "time":"1543110283",
    "previousBlockHash":"9512286ebfaa0fd9de07ecc1020320a7b3847858ba9163655efca85e6d853c91",
    "height":1
  },
  {  
    "hash":"5159d2dedcaac658b3c500d9f982f673166905a10222e961156559d73d171287",
    "body":{  
      "address":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
      "star":{  
        "dec":"-26° 29' 24.9",
        "ra":"16h 29m 1.0s",
        "story":"5374617220322c20466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded":"Star 2, Found star using https://www.google.com/sky/"
      }
    },
    "time":"1543110291",
    "previousBlockHash":"5e95933daa1ba1abce42c3a0dab9bc7cd57899ec2e0b65506df673b28c1e5e16",
    "height":2
  }
]
```

  If the address hasn't been used to register any stars then an empty array will be returned by the request
```
[]
```

###### Get block by block-hash
  To get a block from the blockchain use a HTTP Get request at  
 /stars/hash:**hash-value**   
 where **hash-value** is the hash of the block you are searching for
 
 The block will be returned as a json object  
 for example
```
{  
  "hash":"67633e1b2d64b7b4695ac383b83563362fabcb4a4c3f9dc25e3b1a8c542ec31b",
  "body":{  
    "address":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
    "star":{  
      "dec":"-26° 29' 24.9",
      "ra":"16h 29m 1.0s",
      "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded":"Found star using https://www.google.com/sky/"
    }
  },
  "time":"1543113655",
  "previousBlockHash":"299fc25b3175caba2428064d676c27321cd33dac8c549560e5f2a26d34c67a79",
  "height":1
}
```

  If the block request can not be found a HTTP status of 404 is returned and the following json object
```
{
  "hash": "",
  "height" :-1,
  "body": {
    "address":"",
    "star":{
      "dec":"",
      "ra":"",
      "story":""
    }
  },
  "time": -1,
  "previousBlockHash": "",
  "error": "404 Block 1 not found!"
}
```

### Adding a new star to the blockchain
To add a new block onto the blockchain, use the following process
  
1. Register your address at ``` /requestValidation ```  
1. Verify your address at ``` /message-signature/validate ``` 
1. Post your new star at ``` /block ```    

See full details for each step below  
    
##### HTTP POST
   
###### Register your address
Before adding a star to the blockchain you must first register the address that will be associated with the star.
post a json object with an address field to  
/requestValidation
Example body 
```
{
  "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis"
}
```
Example response
```
{
  "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
  "requestTimeStamp": "1543117068",
  "message": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis:1543117068:starRegistry",
  "validationWindow": 300
}
```
After you recieve a response you will need to verify the address and register your star otherwise the request will 
timeout and you will have to start again. Once the validation window has expired posting to this endpoint with the same 
address will update the requestTimeStamp, message and validationWindow
   
###### Verify your address
To verify your address take the message returned in the /requestValidation response and use a Bitcoin wallet like 
Electrum to sign the message. Take the signature and post it along with the address used to sign the message to the end 
point
/message-signature/validate  

Example body
```
{
  "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
  "signature": "IPAegN1KDtKN47u850CGsdhH7KW1TYlWOGTQqlqbXPfxYQs/QA4oTYPZefLyyOLvXVjCjEHPtKpanvePfd8u9B0="
}
```

Example success response
```
{
  "registerStar": true,
  "status": {
    "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
    "requestTimeStamp": "1543118985",
    "message": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis:1543118985:starRegistry",
    "validationWindow": 280,
    "messageSignature": "valid"
  }
}
```

Example invalid signature response
```
{
  "registerStar": false,
  "status": {
    "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
    "requestTimeStamp": "1543118329",
    "message": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis:1543118329:starRegistry",
    "messageSignature": "invalid"
    "validationWindow": 252,
  }
}
```

Example timeout response
```
{
  "registerStar": false,
  "status": {
    "address": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
    "requestTimeStamp": "1542880933",
    "message": "1FeNfPF9w31VbQMTcjMmZikexvpovSKZis:1542880933:starRegistry",
    "validationWindow": -3,
    "messageSignature": "valid"
  }
}
```  
    
###### Post your new star    
Once your address has been verified you can add your star to the blockchain. Post a json object with your address and 
star details. If you don't register the star before the validation times out you will need to start the process over 
again. You can use the same address to register more than one star

**NB** the story will be truncated if it is longer than 250 character
  
/block

Example body
```
{
  "address":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
  "star":{
    "dec":"-26° 29' 24.9",
    "ra":"16h 29m 1.0s",
    "story":"Found star using https://www.google.com/sky/",
  }
}
```

Example response
```
{  
  "hash":"9c03b383cf7a6e9c1401f12dbe387f276f8b05ded30cd20ed42d71e66ba15c68",
  "body":{  
    "address":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
    "star":{  
      "dec":"-26° 29' 24.9",
      "ra":"16h 29m 1.0s",
      "story":"466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time":"1543119934",
  "previousBlockHash":"335a09aff343ebe0d4c46f4e0a7f9373bc919d4774147413a4dfade1cb7a9889",
  "height":1
}
```   

Example timeout response
```
{  
  "error":"400 verification failed make sure you have registered your address, signed the message and registered the star before the verification expires",
  "verification":{  
    "registerStar":false,
    "status":{  
      "address":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis",
      "requestTimeStamp":"1543119869",
      "message":"1FeNfPF9w31VbQMTcjMmZikexvpovSKZis:1543119869:starRegistry",
      "validationWindow":-227,
      "messageSignature":"valid"
    }
  }
}
```