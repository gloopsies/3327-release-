import type { NetworkParameters } from "../types";
import { CurrencyUnit } from "../types";

export const Optimism: NetworkParameters = {
    parameters: {
        chainName: "Optimism Test Network",
        chainId: "0x45",
        rpcUrls: ["https://kovan.optimism.io"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
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