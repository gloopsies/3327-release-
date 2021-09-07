const hre = require("hardhat");
const Web3 = require('web3'); // Web3 constructor
web3 = new Web3("http://localhost:8545"); // web3 object with Ganache as provider





const weth_address = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const dai_address = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const dai_abi = require("./ERC20.json");
const whale_dai = "0xf7f0CFC3772d29d4CC1482A2ACB7Be16a85a2223";

const dai = new web3.eth.Contract(dai_abi,dai_address) // JavaScript representation of contract



async function run() {
    accounts = await web3.eth.getAccounts();
    //console.log(accounts);
    web3.eth.getChainId().then(console.log);
    const blockNumber = await web3.eth.getBlockNumber();
    console.log(blockNumber);
    
    const d = await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"],
      });
    console.log(d);

    const e = await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0xf7f0CFC3772d29d4CC1482A2ACB7Be16a85a2223"],
      });
    console.log(e);
   
    const totalSupply = await dai.methods.totalSupply().call();
    const balance = await dai.methods.balanceOf(whale_dai).call();
    console.log("totalSupply :", totalSupply);
    console.log("whale balance:", balance);
                                        
    await dai.methods.transfer(accounts[0],"3000000000000000000000").send({from: "0xf7f0CFC3772d29d4CC1482A2ACB7Be16a85a2223" });
    
    const balance1 = await dai.methods.balanceOf(accounts[0]).call();
    console.log("accounts[0] balance: ", balance1);
    /* 
 
    //const swapAmount = await Swap.methods.getAmountOutMin(dai_address, weth_address,"3000000000000000000000").call();
    //console.log(swapAmount);
    */
}

run();

