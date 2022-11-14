// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Token{
    string public name;
    string public symbol;
    uint256 public decimal =18;
    uint256 public totalSupply;
 
    event Transfer(address indexed from, address indexed to, uint256 value);

    mapping(address => uint256) public balanceOf;
    constructor(string memory _name,string memory _symbol ,uint256 _totalSupply){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimal);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to , uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender]>=_value);
        balanceOf[msg.sender] =  balanceOf[msg.sender] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        
        emit Transfer(msg.sender,_to ,_value);
        return true;
    } 
   
   }