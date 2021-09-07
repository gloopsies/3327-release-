import { Writable, writable } from "svelte/store";
import type { Currency, Fundraiser, Notification, User } from "./types";

export const modal_open: Writable<boolean> = writable(false);
export const modal_component: Writable<number> = writable(0);

export const modal_fundraiser: Writable<Fundraiser> = writable({} as Fundraiser);
export const modal_currencies: Writable<Currency[]> = writable([]);

export const loader: Writable<string> = writable(null);

export const notification: Writable<Notification> = writable(null);

export const account: Writable<User> = writable({ logged: false } as User);
export const nft: Writable<any> = writable({});