const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let exchange,feeAccount,accounts,token,user1,deployer;
  const feePercent = 10;
  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Sheryians","SHERY","1000000");

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];

    let transaction = await token.connect(deployer).transfer(user1.address,tokens('10'));
    await transaction.wait(); 

    exchange = await Exchange.deploy(feeAccount.address,feePercent);
});

  describe("deployment", () => {
      it('fee account address',async()=>{
        expect(await exchange.feeAccount()).to.equal(feeAccount.address);
      })  

      it('fee percent ',async()=>{
        expect(await exchange.feePercent()).to.equal(feePercent);
      })   
  });

describe('Deposit token to exchange',()=>{
    let amount = tokens('10');
    let Transaction ,result;
    beforeEach(async()=>{
    //approve
     Transaction = await token.connect(user1).approve(exchange.address,amount);
     result = await Transaction.wait();

    //deposit
     Transaction = await exchange.connect(user1).depositToken(token.address,amount);
     result = await Transaction.wait();
  })

  describe('Succes',()=>{
    it('check exchange balance',async()=>{
      expect(await token.balanceOf(exchange.address)).to.equal(amount);
      expect(await exchange.tokens(token.address,user1.address)).to.be.equal(amount);
      expect(await exchange.balanceOf(token.address,user1.address)).to.be.equal(amount);
    })
    it("emit deposit event", async () => {
      // console.log(result)
      let event = result.events[1];
      expect(await event.event).to.be.equal("Deposit");
      expect(await event.args._token).to.be.equal(token.address);
      expect(await event.args._user).to.be.equal(user1.address);
      expect(await event.args._amount).to.be.equal(amount);
      expect(await event.args._balance).to.be.equal(amount);
    });    
  })

  describe('Failure',()=>{
    it('fails deposit without approval',async()=>{
      await expect(exchange.connect(user1).depositToken(token.address,amount)).to.be.reverted;
    })
  })

})

describe('Withdraw token from exchange',()=>{
  let amount = tokens('10');
  let Transaction ,result;
  beforeEach(async()=>{
  //approve
   Transaction = await token.connect(user1).approve(exchange.address,amount);
   result = await Transaction.wait();

  //deposit
   Transaction = await exchange.connect(user1).depositToken(token.address,amount);
   result = await Transaction.wait();

   //Withdraw
   Transaction = await exchange.connect(user1).withDrawTokens(token.address,amount);
   result = await Transaction.wait();
})

describe('Succes',()=>{
  it('check exchange balance',async()=>{
    expect(await token.balanceOf(exchange.address)).to.equal(0);
    expect(await exchange.tokens(token.address,user1.address)).to.be.equal(0);
    expect(await exchange.balanceOf(token.address,user1.address)).to.be.equal(0);
  })
  it("emit withdraw event", async () => {
    // console.log(result)
    let event = result.events[1];
    expect(await event.event).to.be.equal("Withdraw");
    expect(await event.args._token).to.be.equal(token.address);
    expect(await event.args._user).to.be.equal(user1.address);
    expect(await event.args._amount).to.be.equal(amount);
    expect(await event.args._balance).to.be.equal(0);
  });    
})

describe('Failure',()=>{
  it('insufficient balance',async()=>{
    await expect(exchange.connect(user1).withDrawTokens(token.address,amount)).to.be.reverted;
  })
})

})


 
});