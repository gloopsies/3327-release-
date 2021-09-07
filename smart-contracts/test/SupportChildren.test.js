const assert = require('assert'); // assert module for assertion between values
const SupportChildren_ = require("../build/contracts/SupportChildren.json");
const ganache = require('ganache-cli'); // ganache module for deploying
const Web3 = require('web3'); // Web3 constructor
web3 = new Web3("http://localhost:8545"); // web3 object with Ganache as provider
const SupportChildren_address = SupportChildren_.networks[1].address;
const SupportChildren_abi = SupportChildren_.abi;
let SupportChildren;
let accounts;
let Swap;
let dai;
let usdc;
const Swap_ = require("../build/contracts/Swap.json");
const Swap_abi = Swap_.abi;
const Swap_address = Swap_.networks[1].address;
const dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const usdc_address = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const eth_address = "0x0000000000000000000000000000000000000000";
const weth_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const dai_abi = require("../build/contracts/dai_abi.json")
const usdc_abi = require("../build/contracts/usdc_abi.json");

beforeEach(async () => {

    // Get a list of all accs
    accounts = await web3.eth.getAccounts();
    
    SupportChildren = new web3.eth.Contract(SupportChildren_abi,SupportChildren_address)
    Swap = new web3.eth.Contract(Swap_abi,Swap_address);
    dai = new web3.eth.Contract(dai_abi,dai_address);
    usdc = new web3.eth.Contract(usdc_abi, usdc_address);

    // JavaScript representation of contract
    

    
    

})

describe("Campaign creation", () => {
    
    it("Contract is deployed on right address", () => {
        console.log(accounts);
    })


    it("Should fail to create campaign in past", async () => {   

      try { 
        const currentTimestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp
        await SupportChildren.methods.createCampaign("Campaign", accounts[0], currentTimestamp - 100, "1000000000000000000", eth_address, "IPFS_CID").send({from: accounts[0], gas:"1000000"});
        assert(false);
      }
      catch (err) {
        assert(err);
      }

    })

    it("Should fail to create campaign which accept USDT", async () => {   

      try { 
        const currentTimestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp
        await SupportChildren.methods.createCampaign("Campaign", accounts[0], currentTimestamp - 100, "1000000000000000000", usdt_address, "IPFS_CID").send({from: accounts[0], gas:"1000000"});
        assert(false);
      }
      catch (err) {
        assert(err);
      }

    })

    it("Should fail to create campaign because it's not registered organization", async () => {   

      try { 
        const currentTimestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp
        await SupportChildren.methods.createCampaign("Campaign", accounts[0], currentTimestamp - 100, "1000000000000000000", usdt_address, "IPFS_CID").send({from: accounts[1], gas:"1000000"});
        assert(false);
      }
      catch (err) {
        assert(err);
      }

    })

    it("Should create campaign which accepts ETH", async () => {

      const currentTimestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
      const campaignEndTimestamp = currentTimestamp + 1000;
      await SupportChildren.methods.createCampaign("Campaign", accounts[0],campaignEndTimestamp, "7500000000000000000", eth_address,"IPFS_CID").send({from: accounts[0], gas:"1000000"});
      const campaign = await SupportChildren.methods.getCampaign(0).call();
      assert.equal(campaign.beneficiary, accounts[0]);
      assert.equal(campaign.endTimestamp,campaignEndTimestamp);
      assert.equal(campaign.cryptocurrency, eth_address);
    })    

    it("Acounts[1] Should create campaign which accepts DAI", async () => {

      const currentTimestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
      const campaignEndTimestamp = currentTimestamp + 1000;
      await SupportChildren.methods.approve(accounts[1]).send({from: accounts[0], gas:"1000000"});
      await SupportChildren.methods.createCampaign("Campaign", accounts[3],campaignEndTimestamp, "7580000000000000000000", dai_address,"IPFS_CID").send({from: accounts[1], gas:"1000000"});
      const campaign = await SupportChildren.methods.getCampaign(1).call();
      
      assert.equal(campaign.beneficiary, accounts[3]);
      assert.equal(campaign.endTimestamp,campaignEndTimestamp);
      assert.equal(campaign.cryptocurrency, dai_address);
      
    })

})



describe("Donations", () => {

    it("Should not accept donatios for non-existing campaign", async () => {

        const campaign_id = 5;
        try{
          await SupportChildren.methods.donate(campaign_id, dai_address, 100).send({from: accounts[0], gas:"1000000"});
          assert(false);
      }
        catch(err){
          assert(err);
        }

        try{
          await SupportChildren.methods.donateETH(campaign_id).send({from: accounts[0], value: "10000", gas:"1000000"});
          assert(false);
      }
        catch(err){
          assert(err);
        }
  
    })


    it("Should not accept donatios without amount", async () => {
      const currentTimestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;
      const campaignEndTimestamp = currentTimestamp + 1000;
      await SupportChildren.methods.createCampaign("Campaign", accounts[0],campaignEndTimestamp, "1000000000000000000", eth_address,"IPFS_CID").send({from: accounts[0], gas:"1000000"});
      const campaign_id = 0;
      try{
        await SupportChildren.methods.donate(campaign_id, dai_address, 0).send({from: accounts[0], gas:"1000000"});
        assert(false);
    }
      catch(err){
        assert(err);
      }

      try{
        await SupportChildren.methods.donateETH(campaign_id).send({from: accounts[0], value: "0", gas:"1000000"});
        assert(false);
    }
      catch(err){
        assert(err);
      }

    })

  it("First campaign should accept ETH donation", async () => {
    const campaign_id = 0;
    await SupportChildren.methods.donateETH(campaign_id).send({from: accounts[0], value: "10000", gas:"1000000"});
    const donor_contributions = await SupportChildren.methods.donor_contributions(campaign_id, accounts[0]).call();
    const campaign_contributions = await SupportChildren.methods.campaign_contributions(campaign_id).call();
    const raisedAmount = await SupportChildren.methods.raisedAmount(eth_address).call();
    assert.equal(donor_contributions, 10000);
    assert.equal(campaign_contributions, 10000);
    assert.equal(raisedAmount, 10000);

  })

  it("First campaign should accept DAI donation", async () => {
    const campaign_id = 0;
    await dai.methods.transfer(accounts[0], "8000000000000000000000").send({from: "0xb527a981e1d415af696936b3174f2d7ac8d11369", gas:"1000000"});
    // const balance = await dai.methods.balanceOf(accounts[0]).call();
    // console.log(balance);
    const amount = await Swap.methods.getAmountOutMin(dai_address, weth_address, "4000000000000000000000").call();
    console.log(amount);
    await dai.methods.approve(SupportChildren.options.address, "4000000000000000000000").send({from: accounts[0], gas:"1000000"});
    await SupportChildren.methods.donate(campaign_id, dai_address ,"4000000000000000000000").send({from: accounts[0], gas:"1000000"});
    const donor_contributions = await SupportChildren.methods.donor_contributions(campaign_id, accounts[0]).call();
    // console.log(donor_contributions);    
    assert.equal(+amount+ +10000,donor_contributions);  
    
  })
  
  it("Second campaign should accept USDC donation, ETH donation and DAI donation", async () => {
    // USDC DONATION
    const campaign_id = 1;
    await usdc.methods.transfer(accounts[0], "2100000000").send({from: "0x50b42514389F25E1f471C8F03f6f5954df0204b0", gas:"1000000"});
    const amount = await Swap.methods.getAmountOutMin(usdc_address, dai_address, "2100000000").call();
    //console.log(amount);
    await usdc.methods.approve(SupportChildren.options.address, "2100000000").send({from: accounts[0], gas:"1000000"});
    await SupportChildren.methods.donate(campaign_id, usdc_address ,"2100000000").send({from: accounts[0], gas:"1000000"});
    const donor_contributions = await SupportChildren.methods.donor_contributions(campaign_id, accounts[0]).call();
    //console.log(donor_contributions);    
    assert.equal(donor_contributions, amount);    
    //ETH DONATION
    const amount_eth = await Swap.methods.getAmountOutMin(weth_address, dai_address, "1000000000000000000").call();
    await SupportChildren.methods.donateETH(campaign_id).send({from: accounts[0], value: "1000000000000000000", gas:"1000000"});
    const donor_contributions_new = await SupportChildren.methods.donor_contributions(campaign_id, accounts[0]).call();
    console.log(donor_contributions_new);  
    assert.ok(donor_contributions_new>"5000000000000000000000");  
    //DAI DONATION
    const acc3_balance_before = await dai.methods.balanceOf(accounts[3]).call();
    console.log(acc3_balance_before);
    await dai.methods.approve(SupportChildren.options.address, "2350000000000000000000").send({from: accounts[0], gas:"1000000"});
    const donation = await SupportChildren.methods.donate(campaign_id, dai_address ,"2350000000000000000000").send({from: accounts[0], gas:"1000000"});
    const donor_contributions_new_ = await SupportChildren.methods.donor_contributions(campaign_id, accounts[0]).call();  
    console.log(donor_contributions_new_);
    assert.ok(donor_contributions_new_ > "7400000000000000000000");  
    const GoalReached = donation.events.GoalReached;
    const acc3_balance = await dai.methods.balanceOf(accounts[3]).call();
    console.log(acc3_balance);
    assert.ok(GoalReached);
    console.log("Beneficiary amount: ", acc3_balance- acc3_balance_before);
  })



})