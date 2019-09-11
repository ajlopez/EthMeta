pragma solidity >=0.5.0 <0.6.0;

import "./Game.sol";

contract User {
    Game public game;
    
    constructor(Game _game) public {
        game = _game;
    }
    
    function play(uint8 nrow, uint8 ncol) public {
        game.play(nrow, ncol);
    }
}

