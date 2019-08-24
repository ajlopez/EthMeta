pragma solidity >=0.5.0 <0.6.0;

contract Proxy {
    mapping (address => bool) public whitelist;
    
    constructor() public {
        whitelist[msg.sender] = true;
    }
    
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender]);
        _;
    }
    
    function forward(address to, uint value, bytes memory data) public onlyWhitelisted {
        assembly {
            pop(call(gas, to, value, add(data, 0x20), mload(data), 0, 0))
        }
    }
    
    function setWhitelist(address addr, bool value) public onlyWhitelisted {
        whitelist[addr] = value;
    }
}


