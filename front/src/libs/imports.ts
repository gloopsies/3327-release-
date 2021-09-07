import type { Currency } from "./types";
import { web3 } from "./web3";

export const message_types = Object.freeze(["Question", "Complaint", "Advice", "Other"]);
export const categories = Object.freeze(["Health", "Education", "Empowerment", "Employment", "Arts and Culture", "Human and Civil Rights", "Religion"]);

export enum modals { empty, fundraiser, filters, nft, request, networks, currency }

export let currencies: Currency[] = [];

export const setCurrencies = (cur: Currency[]) => {
    currencies = cur;
};

export const currencyByAddress = (address: string): Currency =>
    currencies.filter(e => e.address === address)[0];

export const currencyByName = (name: string): Currency => {
    return currencies.filter(e => e.name === name)[0];
}

export const currencyPrint = (amount: bigint, currency: Currency = currencies[0]): string =>
    `${web3.utils.fromWei(`${amount}`, currency.unit)} ${currency.name}`;

export const calcExp = (date: string): number => {
    const today = new Date();
    const end = new Date(+`${date}000`);

    return Math.round((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
};

export const toFixedDecimals = (str: string, decimals: number): string => {
    const parts = str.split(".");
    if (parts.length !== 2) return str;

    const [int, float] = parts;

    return `${int}.${float.slice(0, decimals)}`;
};

export function clamp(value: number, min: number, max: number): number
export function clamp(value: bigint, min: bigint, max: bigint): bigint
export function clamp<N extends bigint | number>(value: N, min: N, max: N): N {
    if (value < min) return min;
    if (value > max) return max;

    return value;
}

export function percentageBN(value: bigint, min: bigint, max: bigint): number {
    return Number((BigInt(100) * (value - min)) / (max - min));
}

export function percentage(value: number, min: number, max: number): number {
    return (100 * (value - min)) / (max - min);
}

export const toWei = (value: string, unit: Currency): bigint => BigInt(web3.utils.toWei(value, unit.unit));
export const fromWei = (value: bigint, unit: Currency): string => web3.utils.fromWei(`${value}`, unit.unit);