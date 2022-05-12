 pragma solidity >=0.7.0 <0.9.0;

//the contract allows only the creator to create new coins (diff issuance schemes are possible)
// anyone can send coins w/o registering a username, password - just an eth keypair
contract Coin {
    address public minter;
    mapping (address => uint) public balances;

    
    event Sent(address from, address to, uint amount);

//constructor is only runs when we deploy the contract
    constructor() {
        minter = msg.sender;
    }

//make new coins and send them to an address
//only the owner can send these coins
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        balances[receiver] += amount;
    }

    error insufficientBalance(uint request, uint available);

    function sent(address receiver, uint amount) public {
        if(amount > balances[msg.sender]){
            revert insufficientBalance({
                request: amount,
                available: balances[msg.sender]
            });
        }
            balances[msg.sender] -= amount;
        balances[receiver] += amount;

        emit Sent(msg.sender, receiver, amount);
    }

    
}