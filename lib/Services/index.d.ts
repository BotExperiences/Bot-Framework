import Bot from "../Bot";
import { CommonUserstate } from "tmi.js";
export default class Service {
    bot: Bot;
    onMessage(channel: string, userstate: CommonUserstate, msg: string, self: boolean): void;
    onMonetization(channel: string, userstate: CommonUserstate, msg: string, monetization: any): void;
    onConnected(): void;
}
//# sourceMappingURL=index.d.ts.map