import env from "../.env";
import supportChildrenABI from "../abis/support-children.json";
import ctokenABI from "../abis/ctoken.json";
import factoryABI from "../abis/factory.json";
import erc20 from "../abis/ERC20.json";
import awardABI from "../abis/award.json";
import swapABI from "../abis/swap.json";
import { has_provider, web3 } from "./web3";
import { currencies, currencyByAddress, currencyByName, modals, setCurrencies } from "./imports";
import { modal_component, nft, notification } from "./stores";
import type { Award, Currency, Donation, Fundraiser } from "./types";
import { NotificationType } from "./types";

// @ts-ignore
const ipfs = window.IpfsHttpClient.create({
    host: env.ipfs_address,
    port: 5001,
    protocol: "https",
});

export let chainId;
let supportChildrenContract;
let awardContract;
let swapContract;
let swapFactory;

export const getChainId = async () => {
    const id = await web3.eth.getChainId();
    return `0x${id.toString(16)}`;
};

const setChain = async () => {
    if (!has_provider()) return;
    if (supportChildrenContract) return;

    chainId = await getChainId();
    const network = env.networks.get(chainId);

    supportChildrenContract = new web3.eth.Contract(supportChildrenABI, network.contract_address);
    awardContract = new web3.eth.Contract(awardABI, network.award_address);
    swapContract = new web3.eth.Contract(swapABI, network.swap_address);
    swapFactory = new web3.eth.Contract(factoryABI, env.sushi_factory);

    setCurrencies(network.currencies);
};

export const walletConnect = async (): Promise<void> => {
    // @ts-ignore
    await window.ethereum.request({ method: "eth_requestAccounts" });
};

export const switchChain = async (chainId: string) => {
    if (!has_provider()) return;

    try {
        // @ts-ignore
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId }],
        });
    } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (error.code === 4902) {
            try {
                // @ts-ignore
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [env.networks.get(chainId).parameters],
                });
            } catch (addError) {
                notification.set({
                    type: NotificationType.error,
                    message: addError.message
                })
            }
        }
        notification.set({
            type: NotificationType.error,
            message: error.message
        })
    }

};

export const createCampaign = async (
    wallet: string, name: string, description: string, goal: bigint, endTimeStamp: number, beneficiary: string,
    cryptocurrency: string, category: string, image: File,
): Promise<void> => {

    await setChain();

    const b = await ipfs.add(image);
    const image_cid = b.path;

    const uriObject = {
        description,
        category,
        image: image_cid,
    };

    const buf = JSON.stringify(uriObject);
    const c = await ipfs.add(buf);
    const uri = c.path;

    await supportChildrenContract.methods.createCampaign(name, beneficiary, endTimeStamp, `${goal}`, cryptocurrency, uri).send({ from: wallet });
};

export const getCampaigns = async (): Promise<Fundraiser[]> => {
    await setChain();
    let _campaigns;
    _campaigns = await supportChildrenContract.methods.getCampaigns().call();
    const campaigns: Fundraiser[] = [];

    for (let i = 0; i < _campaigns.length; i++) {
        const [name, organization, endTimestamp, beneficiary, completed, goal, cryptocurrency, uri] = _campaigns[i];
        if (completed) continue;

        const raisedAmount = await supportChildrenContract.methods.campaign_contributions(i).call();

        const ipfs_response = await fetch(`${env.ipfs_data_address}/${uri}`, {
            method: "GET",
        });

        if (ipfs_response.status < 200 && ipfs_response.status >= 300) {
            throw new Error("error connecting to IPFS");
        }

        const { description, image, category } = await ipfs_response.json();
        const image_link = `${env.ipfs_data_address}/${image}`;

        const currency = currencies.find(currency => currency.address === cryptocurrency);

        const campaign: Fundraiser = {
            id: i,
            organization,
            end_date: endTimestamp,
            beneficiary,
            raisedAmount: BigInt(raisedAmount),
            raisedETH: BigInt(1),
            completed,
            goal: BigInt(goal),
            goalETH: BigInt(1),
            currency,
            uri,
            name,
            description,
            image: image_link,
            category,
        };

        campaigns.push(campaign);
    }

    return campaigns;
};

export const isOrganization = async (wallet): Promise<boolean> => {
    await setChain();
    return supportChildrenContract.methods.isOrganization(wallet).call();
};

export const isAdmin = async (wallet): Promise<boolean> => {
    await setChain();
    return wallet === await supportChildrenContract.methods.admin().call();
};

export const getUsersTransactions = async (wallet: string): Promise<Donation[]> => {
    await setChain();

    const events =await supportChildrenContract.getPastEvents("Donation", {
        fromBlock: 0,
        toBlock: "latest",
    })

    return Promise.all(events.filter(e => e.returnValues.from === wallet)
        .map(async (donation): Promise<Donation> => {
                return {
                    from: donation.returnValues.from,
                    hash: donation.transactionHash,
                    campaign: donation.returnValues.name,
                    amount: donation.returnValues.amount,
                    currency: currencyByAddress(donation.returnValues.tokenAddress),
                    time: new Date(await getTimeFromBlock(donation.blockNumber) * 1000),
                };
            },
        ));
};

export const getAwards = async (wallet): Promise<Award[]> => {
    await setChain();

    const awards = await awardContract.getPastEvents("Transfer", {
        fromBlock: 0,
        toBlock: "latest",
    })

    return (await Promise.all(awards.filter(e => e.returnValues.to === wallet)
        .map(async (award): Promise<Award[]> => {
            const ipfs_uri: string = await awardContract.methods.tokenURI(award.returnValues.tokenId).call();
            if (ipfs_uri.length === 0) return [];

            const ipfs_response = await fetch(`${env.ipfs_data_address}/${ipfs_uri}`, {
                method: "GET",
            });

            if (ipfs_response.status < 200 && ipfs_response.status >= 300) {
                throw new Error("error connecting to IPFS");
            }

            const { amount, campaign, category, time, currency } = await ipfs_response.json();

            return [{
                id: award.returnValues.tokenId,
                from: award.returnValues.to,
                hash: ipfs_uri,
                amount,
                campaign,
                category,
                time,
                currency: currencyByAddress(currency),
            }];
        }))).flat() as Award[];
};

export const getDonations = async (): Promise<Donation[]> => {
    await setChain();

    const events = await supportChildrenContract.getPastEvents("Donation", {
        fromBlock: 0,
        toBlock: "latest",
    })

    return Promise.all(events.reverse().slice(0, 10)
        .map(async (donation): Promise<Donation> => {
            return {
                from: donation.returnValues.from,
                hash: donation.transactionHash,
                campaign: donation.returnValues.name,
                amount: donation.returnValues.amount,
                currency: currencyByAddress(donation.returnValues.tokenAddress),
                time: new Date(await getTimeFromBlock(donation.blockNumber) * 1000),
            };
        }),
    );
};

export const getLeaderboard = async (): Promise<Donation[]> => {
    await setChain();

    const events = await supportChildrenContract.getPastEvents("Donation", {
        fromBlock: 0,
        toBlock: "latest",
    })

    return (await Promise.all(events
        .map(async (donation: any): Promise<Donation[]> => {
            const time = new Date(await getTimeFromBlock(donation.blockNumber) * 1000);
            if(new Date().getTime() - time.getTime() > 2592000000) return [];

            const currency = currencyByAddress(donation.returnValues.tokenAddress);
            const amount = BigInt(donation.returnValues.amount);
            const amountETH = await currencySwap(currency, currencies[0], amount);
            return [{
                from: donation.returnValues.from,
                hash: donation.transactionHash,
                campaign: donation.returnValues.name,
                amount: amount,
                amountETH,
                currency,
                time
            }];
        }),
    ))
    .flat().sort(
        (d1: Donation, d2: Donation) => d1.amountETH > d2.amountETH? -1: 1
    ).slice(0, 10) as Donation[];
};

export const donate = async (wallet, campaign, amount, token): Promise<void> => {
    await setChain();
    if (token.address === currencies[0].address) {
        await supportChildrenContract.methods.donateETH(campaign.id).send({ from: wallet, value: amount });
    } else {
        // @ts-ignore
        const ercContract = new web3.eth.Contract(erc20, token.address);
        await ercContract.methods.approve(supportChildrenContract.options.address, amount).send({ from: wallet });
        await supportChildrenContract.methods.donate(campaign.id, token.address, amount).send({ from: wallet });
    }

    modal_component.set(modals.nft);

    const ipfs_award = {
        from: wallet,
        campaign: campaign.name,
        category: campaign.category,
        amount: amount,
        currency: token.address,
        time: new Date().getTime(),
    };

    const uri = await ipfs.add(JSON.stringify(ipfs_award));
    nft.set(uri.path);
};

export const mint_award = async (wallet, uri): Promise<void> => {
    await setChain();
    console.log("URI:", uri);

    await awardContract.methods.awardItem(wallet, uri).send({ from: wallet });
};

export const addOrganization = async (wallet: string, new_wallet: string) => {
    await setChain();
    await supportChildrenContract.methods.approve(new_wallet).send({ from: wallet });
};

export const getWallet = async (): Promise<string> => {
    await walletConnect();

    // @ts-ignore
    return (await web3.eth.getAccounts())[0];
};

export const getTimeFromBlock = async (blockNumber): Promise<number> => {
    const block = await web3.eth.getBlock(blockNumber);

    return block.timestamp;
};

export const swap = async (wallet: string, from: Currency, to: Currency, amount: bigint) => {
    let f = from;
    let t = to;

    if (f.name === "ETH") {
        f = currencyByName("WETH");
    }
    if (t.name === "ETH") {
        t = currencyByName("WETH");
    }

    if (from.name !== "ETH") {
        const ercContract = new web3.eth.Contract(erc20, from.address);
        await ercContract.methods.approve(swapContract.options.address, `${amount}`).send({ from: wallet });
    }

    const outMin = (await swapContract.methods.getAmountsOut(`${amount}`, [f.address, t.address]).call())[1];

    let deadlineDate = new Date();
    deadlineDate.setMinutes(deadlineDate.getMinutes() + 1);
    const deadline = `${deadlineDate.getTime()}000`;

    if (from.name === "ETH") {
        await swapContract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
            outMin, [f.address, t.address], wallet, deadline,
        ).send({ from: wallet, value: `${amount}` });
        return;
    }

    if (to.name === "ETH") {
        await swapContract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
            `${amount}`, outMin, [f.address, t.address], wallet, deadline,
        ).send({ from: wallet });
        return;
    }

    await swapContract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        `${amount}`, outMin, [f.address, t.address], wallet, deadline,
    ).send({ from: wallet });
};

export const currencySwap = async (from: Currency, to: Currency, amount: bigint): Promise<bigint> => {
    await setChain();
    const ethAddress = currencies[0].address;
    const wethAddress = currencyByName("WETH").address;

    if (amount === BigInt(0)) return amount;

    const f = from.address === ethAddress ? wethAddress : from.address;
    const t = to.address === ethAddress ? wethAddress : to.address;

    if (f === t) return amount;
    const returned = (await swapContract.methods.getAmountsOut(`${amount}`, [f, t]).call())[1];
    return BigInt(returned);
};

export const farming_supply = async (fundraiser: Fundraiser): Promise<bigint> => {
    const supply = await supportChildrenContract.methods.farmingSupply(fundraiser.id).call()

    return BigInt(supply)
}

export const get_farming_supply = async (fundraiser: Fundraiser, wallet: string) => {
    await supportChildrenContract.methods.getFundsForFarming(fundraiser.id).send({ from: wallet })
}

export const supply = async (token: Currency, wallet: string, amount: bigint) => {
    const amount2 =  `${amount / BigInt(2)}`
    const ctoken = new web3.eth.Contract(ctokenABI, token.ctoken)

    let ercContract;

    if(token.address === currencies[0].address) {
        // ETH
        await ctoken.methods.mint().send({ from: wallet, value: amount2})
    } else {
        ercContract = new web3.eth.Contract(erc20, token.address);
        await ercContract.methods.approve(token.address, amount2).send({ from: wallet });

        await ctoken.methods.mint(amount2).send({ from: wallet })
    }

    const t = token.address === currencies[0].address ? currencyByName("WETH") : token;

    let pair = await swapFactory.methods.getPair(t.address, token.ctoken).call()
    console.log({ pair })
    if (pair === currencies[0].address) {
        await swapFactory.methods.createPair(t.address, token.ctoken).send({ from: wallet })
        console.log("create pair")
        pair = await swapFactory.methods.getPair(t.address, token.ctoken).send({ from: wallet })
        console.log({ pair2: pair })
    }

    if(token.address !== currencies[0].address) {
        await ercContract.methods.approve(swapContract.options.address, `${amount / BigInt(2)}`).send({ from: wallet });
        await ercContract.methods.approve(pair, `${amount / BigInt(2)}`).send({ from: wallet });
    }


    const ctokenBalance = await ctoken.methods.balanceOf(wallet).call()
    console.log({ctokenBalance})
    const ctokenBalanceMin = `${(BigInt(ctokenBalance) * BigInt(99)) / BigInt(100)}`
    console.log({ctokenBalanceMin})
    const amountMin = `${(BigInt(amount2) * BigInt(10)) / BigInt(100)}`
    console.log({amountMin})
    await ctoken.methods.approve(swapContract.options.address, `${amount / BigInt(2)}`).send({ from: wallet });
    console.log("Approve 3")
    await ctoken.methods.approve(pair, ctokenBalance).send({ from: wallet });
    console.log("Approve 4")

    if(token.address === currencies[0].address) {
        console.log(token.ctoken, ctokenBalance, ctokenBalanceMin, amountMin, wallet, `${new Date().getTime() + 10000}`)
        await swapContract.methods.addLiquidityETH(
            token.ctoken, ctokenBalance, ctokenBalanceMin, amountMin, wallet, `${new Date().getTime() + 10000}`
        ).send({from: wallet, value: amount2})
    } else {
        await swapContract.methods.addLiquidity(
            token.address, token.ctoken, amount2, ctokenBalance, amountMin, ctokenBalanceMin, wallet, `${new Date().getTime() + 10000}`
        ).send({from: wallet})
    }

    console.log("Add Liq")
}