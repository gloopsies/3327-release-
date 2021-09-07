export interface User {
    logged: boolean,
    admin: boolean,
    organization: boolean,
    display_name: string,
    email: string,
    profile_picture: string,
    session: string,
    wallet: string
}

export interface Fundraiser {
    id: number,
    organization: string,
    end_date: string,
    beneficiary: string,
    raisedAmount: bigint,
    raisedETH: bigint,
    completed: boolean,
    goal: bigint,
    goalETH: bigint,
    currency: Currency,
    uri: string,
    name: string,
    description: string,
    image: string,
    category: string,
    days_left?: number
}

export enum CurrencyUnit {
    noether = "noether",        // 0
    wei = "wei",                // 1
    kwei = "kwei",              // 1000
    mwei = "mwei",              // 1000000
    gwei = "gwei",              // 1000000000
    micro = "micro",            // 1000000000000
    milli = "milli",            // 1000000000000000
    ether = "ether",            // 1000000000000000000
    kether = "kether",          // 1000000000000000000000
    mether = "mether",          // 1000000000000000000000000
    gether = "gether",          // 1000000000000000000000000000
    tether = "tether",          // 1000000000000000000000000000000
}

export interface Currency {
    iconClass?: string, // cf-swift
    name: string,
    address: string,
    ctoken: string,
    unit: CurrencyUnit
}

export interface Donation {
    from: string,
    hash: string,
    campaign: string,
    amount: bigint,
    amountETH?: bigint
    currency: Currency,
    time: Date
}

export interface Award {
    id: string,
    from: string,
    hash: string,
    amount: string,
    campaign: string,
    category: string,
    currency: Currency,
    time: Date
}

export interface Request {
    id: string,
    wallet: string,
    display_name: string,
    profile_picture: string,
    message: string,
}

export interface Message {
    id: string,
    wallet: string,
    display_name: string,
    profile_picture: string,
    type: number,
    message: string,
}

export enum NotificationType {
    error = "error",
    warning = "warning",
    information = "information",
    success = "success",
}

export interface Notification {
    message: string,
    type: NotificationType
}

export type transferFunc = (wallet: string, currency: Currency, amount: bigint) => Promise<void>;

export interface NetworkParameters {
    parameters: {
        chainName: string,
        chainId: string,
        rpcUrls: string[],
        nativeCurrency: {
            name: string,
            symbol: string,
            decimals: number,
        },
        blockExplorerUrls: string[]
    },
    currencies: Currency[]
}

export interface Network extends NetworkParameters {
    contract_address: string,
    award_address: string,
    swap_address: string,
    transfers: {
        chainId: string,
        func: transferFunc
    }[]
}