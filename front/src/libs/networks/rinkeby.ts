import type { NetworkParameters } from "../types";
import { CurrencyUnit } from "../types";

export const Rinkeby: NetworkParameters = {
    parameters: {
        chainName: "Rinkeby Test Network",
        chainId: "0x4",
        rpcUrls: ["https://matic-testnet-archive-rpc.bwarelabs.com"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
    },
    currencies: [
        {
            iconClass: "cf-eth",
            name: "ETH",
            address: "0x0000000000000000000000000000000000000000",
            ctoken: "",
            unit: CurrencyUnit.ether,
        }
    ],
};
