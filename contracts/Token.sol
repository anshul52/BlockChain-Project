// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Token{
    string public name;
    string public symbol;
    uint256 public decimal =18;
    uint256 public totalSupply;
 
    // events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    //mapping structures
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address=>uint256)) public allowance;

    constructor(string memory _name,string memory _symbol ,uint256 _totalSupply){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimal);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to , uint256 _value) public returns(bool success){
        require(_to != address(0));

        _transfer(msg.sender,_to,_value);
        return true;
    }

    function _transfer(address _from, address _to,uint256 _value) internal returns(bool success){
        require(balanceOf[_from]>=_value);

        balanceOf[_from] =  balanceOf[_from] - _value;
        balanceOf[_to] = balanceOf[_to] + _value;
        emit Transfer(_from,_to ,_value);
      
        return true;
        
    }

    function approve(address _spender, uint256 _value) public returns(bool success){
       require(_spender != address(0));

       allowance[msg.sender][_spender]  = _value;

        emit Approval(msg.sender, _spender, _value); 
        return true;
    }

    function TransferFrom(address _from,address _to,uint256 _value) public returns(bool success){
     require(_value<= allowance[_from][msg.sender]);
     require(_to != address(0));

     allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

     _transfer(_from,_to,_value);
     return true;

    }


   
}