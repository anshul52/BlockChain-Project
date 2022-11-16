const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, accounts, deployer, receiver,spender;
  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Sheryians", "SHERY", "1000000");

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    spender = accounts[2];
  });
  describe("deployment", () => {
    const name = "Sheryians";
    const symbol = "SHERY";
    const decimal = 18;
    const totalSupply = tokens("1000000");
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

    it("assing totalSupply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe("transfer", () => {
    describe("Success", () => {
      let result, amount;
      beforeEach(async () => {
        amount = tokens("100");
        let transaction = await token
          .connect(deployer)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("sending tokens ", async () => {
        // before transfer
        expect(await token.balanceOf(deployer.address)).to.be.equal(
          tokens("999900")
        );
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
      });

      it("emit transfer event", async () => {
        let event = result.events[0];
        expect(await event.event).to.be.equal("Transfer");
        expect(await event.args.from).to.be.equal(deployer.address);
        expect(await event.args.to).to.be.equal(receiver.address);
        expect(await event.args.value).to.be.equal(amount);
      });
    });

    describe("Failure", () => {
      let invalidAmount, result, transaction;
      beforeEach(async () => {
        transaction = await token.connect(deployer);
      });
      it("reject tranfer on insuffient balance", async () => {
        invalidAmount = tokens("1000000000");
        await expect(transaction.transfer(receiver.address, invalidAmount)).to
          .be.reverted;
      });

      it("reject invalid recipent address", async () => {
        await expect(
          transaction.transfer(
            "0x0000000000000000000000000000000000000000",
            tokens("10")
          )
        ).to.be.reverted;
      });
    });
  });

  describe('Approving tokens' , ()=>{
    
    describe('Success',()=>{
      let transaction, amount,result,args;
     beforeEach(async()=>{
      amount = tokens('100');
      transaction = await token.connect(deployer).approve(spender.address, amount);
      result = await transaction.wait();
     })

     it('allow to spender for spending tokens' ,async()=>{
       expect(await token.allowance(deployer.address,spender.address)).to.be.equal(amount);
     })

     it('check approval event',async ()=>{
      args = result.events[0];
      expect(await args.event).to.be.equal('Approval');
     })

     it('authenticate spender ,deployer',async()=>{
      expect(await args.args.owner).to.be.equal(deployer.address);
      expect(await args.args.spender).to.be.equal(spender.address);
      expect(await args.args.value).to.be.equal(amount);
     })
    })

    describe('Failure',()=>{
      let transaction;
      beforeEach(async () => {
        transaction = await token.connect(deployer);
      });

      it("reject invalid recipent address", async () => {
        await expect(
          transaction.approve(
            "0x0000000000000000000000000000000000000000",
            tokens("10")
          )
        ).to.be.reverted;
      });
    })
  })

  describe('delegated token allowance' , ()=>{
    let transaction, amount,result;
    beforeEach(async()=>{
     amount = tokens('100');
     transaction = await token.connect(deployer).approve(spender.address, amount);
     result = await transaction.wait();
    })

    describe('Success',()=>{
      let tranfer_from , res;
     beforeEach(async()=>{
       tranfer_from = await token.connect(spender).TransferFrom(deployer.address,receiver.address,amount);
       res = await tranfer_from.wait();
     })

     it('check balance',async()=>{
      expect(await token.balanceOf(deployer.address)).to.be.equal(tokens('999900'));
      expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
     })

     it('check zero allowance',async()=>{
      expect(await token.allowance(deployer.address,spender.address)).to.be.equal(0);
     })

     it("emit transfer event", async () => {
      let event = res.events[0];
      expect(await event.event).to.be.equal("Transfer");
      expect(await event.args.from).to.be.equal(deployer.address);
      expect(await event.args.to).to.be.equal(receiver.address);
      expect(await event.args.value).to.be.equal(amount);
    });      

    })

    describe('Failure' , ()=>{
      it("reject tranfer on insuffient balance", async () => {
        invalidAmount = tokens("1000000000");
        await expect(token.connect(spender).TransferFrom(deployer.address,receiver.address, invalidAmount)).to
          .be.reverted;
      });

      it("reject invalid recipent address", async () => {
        await expect(
          token.connect(spender).TransferFrom(deployer.address,
            "0x0000000000000000000000000000000000000000",
            tokens("10")
          )
        ).to.be.reverted;
      });
    })

  })
});