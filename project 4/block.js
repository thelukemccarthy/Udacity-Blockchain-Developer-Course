class Block{
  // Should expect data to be the following
  // {
  //   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  //   "star": {
  //     "dec": "-26° 29'\'' 24.9",
  //     "ra": "16h 29m 1.0s",
  //     "story": "Found star using https://www.google.com/sky/"
  // }

  constructor(data){
    this.hash = '',
    this.height = 0,
    this.body = {},
    this.body.address = data && data.address || ''
    this.body.star = data && data.star || {}
    this.time = 0,
    this.previousBlockHash = ''
  }

  // createBlockToStore(data) {
  //   const star = Object.assign({star: {}}, data);
  //   star.star.story = data && data.star && data.star.story && data.star.story.substring(0, 250) || '';
  //   star.star.story = Buffer.from(data.star.story, 'utf8').toString('hex');
  //
  //   return {
  //     'hash': '',
  //     'body': {
  //       'address': star.address,
  //       'star': star.star
  //     },
  //     'time': 0,
  //     'previousBlockHash': ''
  //   };
  // }

  static createGenesisBlock(){
    return {
      'address': '',
      'star': {
        'dec': '',
        'ra': '',
        'story': 'First block in the chain - Genesis block'
      }
    }
  }

  getNullBlock() {
    return {
      'hash': '',
      'height': -1,
      'body': {
        'address': '',
        'star': {
          'dec': '',
          'ra': '',
          'story': ''
        },
      },
      'time': -1,
      'previousBlockHash':''
    };
  };
}

module.exports = {
  Block
}
