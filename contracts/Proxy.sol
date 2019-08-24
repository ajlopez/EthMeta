pragma solidity >=0.5.0 <0.6.0;

contract Proxy {
    function forward(address to, uint value, bytes memory data) public {
        assembly {
            pop(call(gas, to, value, add(data, 0x20), mload(data), 0, 0))
        }
    }
}


