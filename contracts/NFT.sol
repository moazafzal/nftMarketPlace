// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage{
    uint public tokenCount;
    constructor() ERC721("MZ_NFT","MZ_Creater"){    
    }

    function mint(string memory tokenURI) external returns(uint256){
        tokenCount++;
        _safeMint(msg.sender,tokenCount);
        _setTokenURI(tokenCount,tokenURI);
        return (tokenCount);
    }
}