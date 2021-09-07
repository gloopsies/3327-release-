import type { NetworkParameters } from "../types";
import { CurrencyUnit } from "../types";

export const Arbitrum: NetworkParameters = {
    parameters: {
        chainName: "Arbitrum Test Network",
        chainId: "0x66eeb",
        rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
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