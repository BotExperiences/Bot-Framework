"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bot {
    constructor(config, client, 
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    context, // eslint-disable-line @typescript-eslint/no-explicit-any
    services = []) {
        this.mods = [];
        this.vips = [];
        // Save references
        this.config = config;
        this.context = context;
        this.services = services;
        // Setup services
        services.forEach((service) => {
            service.bot = this;
        });
        this.chatClient = client;
        //#region setup chatClient hooks
        this.chatClient.on('message', this.onMessage.bind(this));
        this.chatClient.on('connected', this.onConnected.bind(this));
        // Monetization
        this.chatClient.on('anongiftpaidupgrade', (channel, username, userstate) => {
            this.onMonetization(channel, userstate, '', { type: 'anongiftpaidupgrade' });
        });
        this.chatClient.on('cheer', (channel, userstate, message) => {
            this.onMonetization(channel, userstate, message, { type: 'cheer' });
        });
        this.chatClient.on('giftpaidupgrade', (channel, username, sender, userstate) => {
            this.onMonetization(channel, userstate, '', { type: 'giftpaidupgrade', sender });
        });
        this.chatClient.on('resub', (channel, username, months, message, userstate, methods) => {
            this.onMonetization(channel, userstate, message, { type: 'resub', months, methods });
        });
        this.chatClient.on('subgift', (channel, username, streakMonths, recipient, methods, userstate) => {
            this.onMonetization(channel, userstate, '', { type: 'subgift', streakMonths, recipient, methods });
        });
        this.chatClient.on('submysterygift', (channel, username, numbOfSubs, methods, userstate) => {
            this.onMonetization(channel, userstate, '', { type: 'submysterygift', numbOfSubs, methods });
        });
        this.chatClient.on('subscription', (channel, username, method, message, userstate) => {
            this.onMonetization(channel, userstate, message, { type: 'subscription', method });
        });
        //#endregion
        // Connect to chat!
        this.chatClient.connect();
    }
    onConnected( /* addr: string, port: number */) {
        if (!this.config.silent && this.config.connectedMessage)
            this.sendChatMessage(this.config.connectedMessage);
        this.services.forEach((service) => {
            service.onConnected();
        });
        // Get mod and VIP lists
        this.chatClient.mods(this.config.channel).then(data => this.mods = data);
        this.chatClient.vips(this.config.channel).then(data => this.vips = data);
    }
    onMessage(channel, userstate, msg, self) {
        if (this.config.banList.includes(userstate["display-name"]))
            return;
        // TODO logging;
        // console.log('onMessage', channel, userstate["display-name"], msg);
        this.services.forEach((service) => {
            service.onMessage(channel, userstate, msg, self);
        });
    }
    onMonetization(channel, userstate, msg, monetization) {
        this.services.forEach((service) => {
            service.onMonetization(channel, userstate, msg, monetization);
        });
    }
    sendChatMessage(message) {
        if (!this.config.silent)
            this.chatClient.say(this.config.channel, message);
    }
}
exports.default = Bot;
