export const web3 = (() => {
    // @ts-ignore
    if (window.ethereum) {
        // @ts-ignore
        return new Web3(window.ethereum);
    } else {
        console.error("No web3 support present");
        return null;
    }
})();

// @ts-ignore
export const has_provider = (): boolean => typeof window.ethereum !== "undefined" || window.ethereum != null;