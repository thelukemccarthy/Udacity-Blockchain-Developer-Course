pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    struct Star {
        string name;
        string starStory;
        string ra;   // Right Ascension
        string dec;  // Declination
        string mag;  // Magnitude
        string cen;  // Centaurus
    }

    uint256[] private tokenIds;
    mapping(string => bool) private coordinatesUsed;
    mapping(uint256 => Star) public tokenIdToStarInfoMapping;
    mapping(uint256 => uint256) public starsForSale;


    function concatStrings(string _value1, string _value2) private pure returns(string) {
        bytes memory b1 = bytes(_value1);
        bytes memory b2 = bytes(_value2);

        return string(abi.encodePacked(b1, b2));
    }

    function checkForEmptyString(string _value, string _errorMessage) private pure {
        bytes memory convertedString = bytes(_value);
        require(convertedString.length > 0, _errorMessage);
    }

    function addPrefixToStringOrDefault(string _prefix, string _value) private pure returns(string) {
        bytes memory convertedString = bytes(_value);

        if(convertedString.length == 0) {
            return '';
        }

        return concatStrings(_prefix, _value);
    }

    function hasTokenBeenUsed(uint256 _tokenId) private view returns(bool){
        Star storage currentStar = tokenIdToStarInfoMapping[_tokenId];
        bytes memory nameAsBytes = bytes(currentStar.name);

        return nameAsBytes.length > 0;
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string, string){
        require(hasTokenBeenUsed(_tokenId), 'No star found for the token id provided');

        Star storage currentStar = tokenIdToStarInfoMapping[_tokenId];
        return (
            currentStar.name,
            currentStar.starStory,
            concatStrings('ra_', currentStar.ra),
            concatStrings('dec_', currentStar.dec),
            addPrefixToStringOrDefault('mag_', currentStar.mag),
            addPrefixToStringOrDefault('cen_',currentStar.cen)
        );
    }

    function checkIfStarExist(string _ra, string _dec) public view returns(bool){
//        Star memory currentStar;
//        for (uint256 i = 0; i < tokenIds.length; i++){
//            currentStar = tokenIdToStarInfoMapping[tokenIds[i]];
//            if(keccak256(bytes(currentStar.ra)) == keccak256(bytes(_ra)) && keccak256(bytes(currentStar.dec)) == keccak256(bytes(_dec))){
//                return true;
//            }
//        }
//        return false;
        return coordinatesUsed[concatStrings(_ra, _dec)];
    }

    function mint(uint256 _tokenId) public {
        _mint(msg.sender, _tokenId);
    }

    function createStar(string _name, string _starStory, string _ra, string _dec, string _mag, string _cen, uint256 _tokenId) public {
        checkForEmptyString(_name, 'A star name is required');
        checkForEmptyString(_starStory, 'A star story is required');
        checkForEmptyString(_ra, 'The star\'s ra is required');
        checkForEmptyString(_dec, 'The star\'s dec is required');
        require(!hasTokenBeenUsed(_tokenId), 'The tokenId has already been used');
        require(!checkIfStarExist(_ra, _dec), 'The star has already been claimed');

        tokenIdToStarInfoMapping[_tokenId] = Star(_name, _starStory, _ra, _dec, _mag, _cen);
        coordinatesUsed[concatStrings(_ra, _dec)] = true;

        mint(_tokenId);
        // tokenIds.push(_tokenId); // this isn't needed anymore
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }
}