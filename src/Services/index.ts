/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Bot from "../Bot";

export default class Service {
    bot: Bot;
    onMessage(channel: string, userstate: UserState, msg: string, self: boolean): void {}
    onMonetization(channel: string, userstate: UserState, msg: string, monetization: any): void {}
    onConnected(): void {}
}
