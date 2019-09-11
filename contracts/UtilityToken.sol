pragma solidity >=0.5.0 <0.6.0;

import "./zeppelin/ERC20.sol";
import "./zeppelin/ERC20Mintable.sol";

contract UtilityToken is ERC20, ERC20Mintable {
    mapping (address => bool) public users;
    
    constructor() public {
    }
    
    function mint(address account, uint256 amount) public onlyMinter returns (bool) {
        bool result = super.mint(account, amount);
        
        if (result)
            users[account] = true;
            
        return result;
    }    
}

