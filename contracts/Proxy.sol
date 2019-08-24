pragma solidity >=0.5.0 <0.6.0;

contract Proxy {
    address owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function forward(address to, uint value, bytes memory data) public {
        require(msg.sender == owner);
        
        assembly {
            pop(call(gas, to, value, add(data, 0x20), mload(data), 0, 0))
        }
    }
}


