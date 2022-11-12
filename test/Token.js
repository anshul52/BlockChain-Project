const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n)=>{
  return ethers.utils.parseUnits(n.toString(), "ether");
}

describe("Token", () => {
  let token , accounts , deployer , receiver;
  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Sheryians" , "SHERY", "1000000");
    
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];

  });
  describe("deployment", () => {
    const name = "Sheryians";
    const symbol = "SHERY";
    const decimal = 18;
    const totalSupply = tokens('1000000');
    it("has a name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has a symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has a decimal", async () => {
      expect(await token.decimal()).to.equal(decimal);
    });
    it("has a totalSupply", async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });
    
    it('assing totalSupply to deployer' , async()=>{
      console.log(deployer.address);
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    })

  });

  describe('transfer',()=>{

    describe('success',()=>{
      let result , amount;
      beforeEach(async()=>{
        amount = tokens('100');
        let transaction = await token.connect(deployer).transfer(receiver.address,amount);
        result = await transaction.wait();
      })

        it('sending tokens ',async()=>{
          // before transfer
        expect(await token.balanceOf(deployer.address)).to.be.equal(tokens('999900'));
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
        })

        it('emit transfer event' , async()=>{
          let event = result.events[0]
           expect(await event.event).to.be.equal("Transfer");
           expect(await event.args.from).to.be.equal(deployer.address);
           expect(await event.args.to).to.be.equal(receiver.address);
           expect(await event.args.value).to.be.equal(amount);
        })
    })

    describe('failure',()=>{
      let invalidAmount , result;
      it('reject tranfer on insuffient balance', async()=>{
        invalidAmount = tokens('1000000000');
        let transaction = await token.connect(deployer);
       
        await expect(transaction.transfer(receiver.address,invalidAmount)).to.be.reverted;
      })
    })
   
  })
});