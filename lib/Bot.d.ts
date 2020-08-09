import Service from './Services';
export interface BotConfig {
    channel: string;
    banList: string[];
    silent: boolean;
    connectedMessage?: string;
}
declare type tmiEvent = 'message' | 'connected' | 'anongiftpaidupgrade' | 'cheer' | 'giftpaidupgrade' | 'resub' | 'subgift' | 'submysterygift' | 'subscription' | 'join' | 'part';
import { ChatUserstate } from 'tmi.js';
export interface ChatClient {
    on: (event: tmiEvent, callback: (...args: any[]) => void) => void;
    connect: () => void;
    say: (channel: string, message: string) => void;
    mods: (channel: string) => Promise<string[]>;
    vips: (channel: string) => Promise<string[]>;
}
export interface UserState extends ChatUserstate {
}
export default class Bot {
    constructor(config: BotConfig, client: ChatClient, context: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    services?: Service[]);
    config: BotConfig;
    context: any;
    chatClient: ChatClient;
    private services;
    mods: string[];
    vips: string[];
    onConnected(): void;
    onMessage(channel: string, userstate: UserState, msg: string, self: boolean): void;
    onMonetization(channel: string, userstate: UserState, msg: string, monetization: any): void;
    onJoin(channel: string, username: string, self: boolean): void;
    onPart(channel: string, username: string, self: boolean): void;
    sendChatMessage(message: string): void;
}
export {};
//# sourceMappingURL=Bot.d.ts.map