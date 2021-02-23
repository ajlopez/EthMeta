pragma solidity ^0.6.0;

import "./UtilityToken.sol";

contract Game {
    UtilityToken public token;
    address[8][8] public owners;
    
    constructor(UtilityToken _token) public {
        token = _token;
    }
    
    function play(uint nrow, uint ncol) public {
        require(msg.sender != tx.origin);
        require(token.pay(msg.sender, tx.origin, 10));
        
        if (owners[nrow][ncol] == address(0))
            owners[nrow][ncol] = msg.sender;
    }
}


