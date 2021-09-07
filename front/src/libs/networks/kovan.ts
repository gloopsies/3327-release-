import type { NetworkParameters } from "../types";
import { CurrencyUnit } from "../types";

export const Kovan: NetworkParameters = {
    parameters: {
        chainName: "Kovan Test Network",
        chainId: "0x2a",
        rpcUrls: ["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrls: ["https://kovan.etherscan.io"],
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