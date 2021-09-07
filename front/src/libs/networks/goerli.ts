import { web3 } from "../web3";

import type { Currency, NetworkParameters } from "../types";
import { CurrencyUnit } from "../types";

import rootChainManagerABI from "../../abis/polygon-root-chain.json";
import erc20ABI from "../../abis/ERC20.json";
import polygonFxRootTunnel from "../../abis/polygonFxRootTunnel.json";
import { MaticPOSClient } from "@maticnetwork/maticjs";

const maticProvider = "https://rpc-mumbai.maticvigil.com/v1/1687de1f3c6140c3f4464d3738089a82b5699a1a";

const params = {
    network: "testnet",
    version: "mumbai",
    parentProvider: web3,
    maticProvider: maticProvider,
};

const maticPOSClient = new MaticPOSClient(params);

export const Goerli: NetworkParameters = {
    parameters: {
        chainName: "Goerli Test Network",
        chainId: "0x5",
        rpcUrls: ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://goerli.etherscan.io"],
    },
    currencies: [
        {
            iconClass: "cf-eth",
            name: "ETH",
            address: "0x0000000000000000000000000000000000000000",
            ctoken: "0x20572e4c090f15667cf7378e16fad2ea0e2f3eff",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-weth",
            name: "WETH",
            address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-bnb",
            name: "BNB",
            address: "0xDe47B6245b566c885E2ef5E1a948D8Be79468e9f",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-busd",
            name: "BUSD",
            address: "0x84bcD22C652E577C28c8076888850C79a67F5A33",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-dai",
            name: "DAI",
            address: "0x5a3891cB14295320D6d65E262fecFFaCB164Cc72",
            ctoken: "",
            unit: CurrencyUnit.ether,
        }
    ],
};

const fxTunnelAddress = "0xbfDeFCd92335b22b205bb5b63B9eC909D6e99C16";

const rootChainManagerAddress = "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74";

export const toPolygon = async (wallet: string, currency: Currency, amount: bigint) => {

    if (currency.name === "ETH") {
        const rootChainManagerContract = new web3.eth.Contract(rootChainManagerABI, rootChainManagerAddress);
        await rootChainManagerContract.methods
            .depositEtherFor(wallet).send({ from: wallet, value: `${amount}` });
        return;
    }

    const erc20 = new web3.eth.Contract(erc20ABI, currency.address);
    await erc20.methods.approve(fxTunnelAddress, `${amount}`).send({ from: wallet });

    const fxTunnel = new web3.eth.Contract(polygonFxRootTunnel, fxTunnelAddress);
    await fxTunnel.methods.deposit(currency.address, wallet, `${amount}`, "0x0").send({ from: wallet });
};

export const burn = async (wallet: string, tx: any) => {
    if(tx.type === "WETH") {
        const exitCalldata = await maticPOSClient
            .exitERC20(tx.hash, { from: wallet, encodeAbi: true })

        await web3.eth.sendTransaction({
            from: wallet,
            to: rootChainManagerAddress,
            data: exitCalldata.data
        })
        return
    }
    // @ts-ignore
    const proof = await maticPOSClient.posRootChainManager.exitManager.buildPayloadForExit(
         tx.hash, "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036",
    );

    const fxTunnel = new web3.eth.Contract(polygonFxRootTunnel, fxTunnelAddress);
    await fxTunnel.methods.receiveMessage(proof).send({from: wallet})
}