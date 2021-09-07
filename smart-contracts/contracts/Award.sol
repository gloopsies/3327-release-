// SPDX-License-Identifier: MIT
pragma solidity >=0.7.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // changed import
import "@openzeppelin/contracts/utils/Counters.sol";


contract Award is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    constructor(string memory _name, string memory _symbol)
    ERC721(_name, _symbol) {}

    function awardItem(address player, string memory tokenURI) public returns (uint256)

    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
