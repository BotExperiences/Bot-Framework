/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Bot from "../Bot";

export default class Service {
    bot: Bot;
    // TODO userstate interface
    onMessage(channel: string, userstate: { 'display-name': string }, msg: string, self: boolean): void {}
    onConnected(): void {}
}
