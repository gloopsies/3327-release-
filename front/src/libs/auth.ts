import { account } from "./stores";
import jwt_decode from "jwt-decode";
import type { User } from "./types";
import env from "../.env";
import { web3 } from "./web3";
import { isAdmin, isOrganization } from "./blockchain";

const set_account = async (token: string) => {
    const user: User = jwt_decode(token);
    user.logged = true;
    user.organization = await isOrganization(user.wallet);
    user.admin = await isAdmin(user.wallet);
    account.set(user);
};

export const loggedIn = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        return false;
    }

    const response = await fetch(`${env.api_url}/logged`, {
        method: "POST",
        body: `{"jwt": "${jwt}"}`,
    });

    if (response.status >= 200 && response.status < 300) {
        const token = localStorage.getItem("jwt");
        await set_account(token);
        return true;
    }

    return false;
};

export const auth = async (nonce: string, wallet: string) => {
    // @ts-ignore
    await web3.eth.personal.sign(nonce, wallet, (error: Error, signature: string) => {
        if (error != null) {
            throw error;
        }

        const func = async () => {
            const login_response = await fetch(
                `${env.api_url}/login`,
                {
                    method: "POST",
                    body: `{
                        "wallet": "${wallet}",
                        "signature": "${signature}"
                    }`,
                },
            );

            if (login_response.status >= 200 && login_response.status < 300) {
                const token = await login_response.text();
                localStorage.setItem("jwt", token);
                await set_account(token);
            } else {
                localStorage.setItem("jwt", "none");
            }
        };

        func();
    });
};

export const login = async (wallet: string) => {
    const nonce_response = await fetch(`${env.api_url}/nonce`, {
        method: "POST",
        body: `${wallet}`,
    });

    if (nonce_response.status >= 200 && nonce_response.status < 300) {
        const nonce = await nonce_response.text();

        return await auth(nonce, wallet);
    }

    if (nonce_response.status === 403) {
        const register_response = await fetch(
            `${env.api_url}/register`,
            {
                method: "POST",
                // @ts-ignore
                body: `${(await web3.eth.getAccounts())[0]}`,
            },
        );

        if (register_response.status >= 200 && register_response.status < 300) {
            const nonce = await register_response.text();

            return await auth(nonce, wallet);
        }
    }

    throw new Error("Error logging in with your wallet provider");
};

export const update = async ({ display_name, email, profile_picture }: User) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        return false;
    }

    const response = await fetch(
        `${env.api_url}/user`,
        {
            method: "PATCH",
            body: `{
                "jwt": "${jwt}",
                "display_name": "${display_name}",
                "email": "${email}",
                "profile_picture": "${profile_picture}"
            }`,
        },
    );

    if (response.status >= 200 && response.status < 300) {
        const token = await response.text();
        localStorage.setItem("jwt", token);
        await set_account(token);
    } else {
        localStorage.setItem("jwt", "none");
    }
};

export const logOut = async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt.length == 0 || jwt === "none") {
        return;
    }

    await fetch(`${env.api_url}/logout`, {
        method: "POST",
        body: `{"jwt": "${jwt}"}`,
    });

    localStorage.setItem("jwt", "none");
    account.set({ logged: false } as User);
};
