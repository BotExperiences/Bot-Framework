"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bot {
    constructor(config, client, context, services = []) {
        // Save references
        this.config = config;
        this.context = context;
        this.services = services;
        // Setup services
        services.forEach((service) => {
            service.bot = this;
        });
        this.chatClient = client;
        this.chatClient.on('message', this.onMessage.bind(this));
        this.chatClient.on('connected', this.onConnected.bind(this));
        // Connect to chat!
        this.chatClient.connect();
        // Setup tmi.js
        // this.tmiClient = tmi.client({
        //   options: { debug: true },
        //   identity: {
        //     username: config.credentials.username,
        //     password: config.credentials.password
        //   },
        //   channels: [ config.credentials.channel ]
        // });
        // this.tmiClient.on('message', this.onMessage.bind(this));
        // this.tmiClient.on('connected', this.onConnected.bind(this));
    }
    onConnected(addr, port) {
        if (!this.config.silent && this.config.connectedMessage)
            this.sendChatMessage(this.config.connectedMessage);
        this.services.forEach((service) => {
            service.onConnected();
        });
    }
    // TODO userstate interface
    onMessage(channel, userstate, msg, self) {
        if (this.config.banList.includes(userstate["display-name"]))
            return;
        // TODO logging;
        // console.log('onMessage', channel, userstate["display-name"], msg);
        this.services.forEach((service) => {
            service.onMessage(channel, userstate, msg, self);
        });
    }
    sendChatMessage(message) {
        if (!this.config.silent)
            this.chatClient.say(this.config.channel, message);
    }
}
exports.default = Bot;
