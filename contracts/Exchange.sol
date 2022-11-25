// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => Order) public orderMapping;

    event Deposit(
        address _token,
        address _user,
        uint256 _amount,
        uint256 _balance
    );
    event Withdraw(
        address _token,
        address _user,
        uint256 _amount,
        uint256 _balance
    );

    struct Order {
        uint256 Order_id;
        address user;
        address _tokenGive;
        uint256 _amountGive;
        address _tokenGet;
        uint256 _amountGet;
        uint256 timestamp;
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // deposit
    function depositToken(address _token, uint256 amount) public {
        //deposit tokens to exchange
        require(Token(_token).TransferFrom(msg.sender, address(this), amount));

        //update or mapping
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + amount;

        emit Deposit(_token, msg.sender, amount, tokens[_token][msg.sender]);
    }

    //withdraw tokens
    function withDrawTokens(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount);

        Token(_token).transfer(msg.sender, _amount);
        //update or mapping
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //make order or cancel order
    // _AmountGive - amount from other party
    //_AmountGet -  taker
    function makeOrder(
        address _tokenGive,
        uint256 _amountGive,
        address _tokenGet,
        uint256 _amountGet
    ) public {
      
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }
}