import Bot from "../Bot";

export default class BaseService {
    bot: Bot;
    onMessage(channel: string, userstate: any, msg: string, self: boolean): void {}
    onConnected(): void {}
}