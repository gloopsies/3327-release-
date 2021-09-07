import type { NetworkParameters } from "../types";
import { Currency, CurrencyUnit } from "../types";
import { web3 } from "../web3";
import erc20ABI from "../../abis/ERC20.json";
import polygonFxChildTunnel from "../../abis/polygonFxChildTunnel.json";
import { MaticPOSClient } from "@maticnetwork/maticjs";

export const Polygon: NetworkParameters = {
    parameters: {
        chainName: "Polygon Test Network",
        chainId: "0x13881",
        rpcUrls: ["https://matic-testnet-archive-rpc.bwarelabs.com"],
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
    },
    currencies: [
        {
            iconClass: "cf-eth",
            name: "MATIC",
            address: "0x0000000000000000000000000000000000000000",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-weth",
            name: "WETH",
            address: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-bnb",
            name: "BNB",
            address: "0x7ae4feC557297e41106B478AebBFD7D8a7bBdd06",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-busd",
            name: "BUSD",
            address: "0x466fECa2c4cc995Ef48a1F8F0Df1Eb9E6c6aAB8e",
            ctoken: "",
            unit: CurrencyUnit.ether,
        },
        {
            iconClass: "cf-dai",
            name: "DAI",
            address: "0xD38ac090fa6013444ef9214E53a9C6986A7A02E7",
            ctoken: "",
            unit: CurrencyUnit.ether,
        }
    ],
};

export const toGoerli = async (wallet: string, currency: Currency, amount: bigint) => {
    const fxTunnelAddress = "0xd0ddbab3bD60E591c300b2e365D732d9Ce76D3fd";

    if (currency.name === "MATIC") {
        throw Error("You can't transfer MATIC to Layer 1");
    }

    const erc20 = new web3.eth.Contract(erc20ABI, currency.address);

    if (currency.name === "WETH") {
        const maticPOSClient = new MaticPOSClient({
            network: "testnet",
            version: "mumbai",
            parentProvider: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            maticProvider: web3,
        });

        const burn = await maticPOSClient.burnERC20(currency.address, `${amount}`, { from: wallet });

        let withdrawals: any[] = JSON.parse(localStorage.getItem("withdrawals"))
        if (withdrawals === null) withdrawals = []
        withdrawals = [...withdrawals, { type: "WETH", hash: burn.transactionHash }]
        localStorage.setItem("withdrawals", JSON.stringify(withdrawals))
        return;
    }

    await erc20.methods.approve(fxTunnelAddress, `${amount}`).send({ from: wallet });

    const fxTunnel = new web3.eth.Contract(polygonFxChildTunnel, fxTunnelAddress);

    // @ts-ignore
    const tx = await fxTunnel.methods.withdraw(currency.address, `${amount}`).send({ from: wallet });

    let withdrawals: any[] = JSON.parse(localStorage.getItem("withdrawals"))
    if (withdrawals === null) withdrawals = []
    withdrawals = [...withdrawals, { type: "ERC20", hash: tx.transactionHash }]
    localStorage.setItem("withdrawals", JSON.stringify(withdrawals))
};