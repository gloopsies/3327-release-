import env from "../.env";
import type { Message, Request } from "./types";

export const getRequests = async (): Promise<Request[]> => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        throw "Please log-in first";
    }

    const response = await fetch(`${env.api_url}/requests`, {
        method: "POST",
        body: `{"jwt": "${jwt}"}`,
    });

    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }

    throw await response.text();
};

export const deleteRequest = async (id: string) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        throw "Please log-in first";
    }

    await fetch(`${env.api_url}/request/${id}`, {
        method: "DELETE",
        body: `{"jwt": "${jwt}"}`,
    });
};

export const sendRequest = async (message: string) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        throw "Please log-in first";
    }

    const response = await fetch(`${env.api_url}/request`, {
        method: "POST",
        body: `{"jwt": "${jwt}", "message" : "${message}"}`,
    });

    if (response.status >= 200 && response.status < 300) return;

    throw new Error(await response.text());

};

export const getMessages = async (): Promise<Message[]> => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        throw "Please log-in first";
    }

    const response = await fetch(`${env.api_url}/messages`, {
        method: "POST",
        body: `{"jwt": "${jwt}"}`,
    });

    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }

    throw await response.text();
};

export const deleteMessage = async (id: string) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        throw "Please log-in first";
    }

    await fetch(`${env.api_url}/message/${id}`, {
        method: "DELETE",
        body: `{"jwt": "${jwt}"}`,
    });
};

export const sendMessage = async (type: number, message: string) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || jwt.length == 0 || jwt === "none") {
        throw "Please log-in first";
    }

    const response = await fetch(`${env.api_url}/message`, {
        method: "POST",
        body: `{"jwt": "${jwt}", "type": ${type},"message": "${message}"}`,
    });

    if (response.status >= 200 && response.status < 300) return;

    throw new Error(await response.text());
};