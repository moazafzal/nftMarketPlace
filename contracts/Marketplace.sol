// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount; //account that receive fees
    uint public immutable feePercent; //fee percentage on sale
    uint public itemCount;
    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;   
    }

    mapping (uint => Item) public items;

    event offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    function makeItem(IERC721 _nft,uint _tokenId,uint _price)  external nonReentrant {
        require(_price > 0, "price must be greater then zero");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
        

        
    }
    function purchaseItem(uint _itemId) external payable nonReentrant () {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId>0 && _itemId<=itemCount,'Item Does Not Exist');
        require(msg.value>=_totalPrice,"Not enough Ether to purchase item and pay fee");
        require(!item.sold,"item already Sold");

        //pay seller and fee account
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        //update Item to sold
        item.sold = true;

        //transfer Nft to buyyer
        item.nft.transferFrom(address(this),msg.sender,item.tokenId);

        //emit Bought Event
        emit Bought(
        _itemId,
        address(item.nft),
        item.tokenId,
        item.price,
        item.seller,
        msg.sender
        );    
    }
    function getTotalPrice(uint itemId)view public  returns (uint) {
        return((items[itemId].price*(100+feePercent))/100);
    }
}