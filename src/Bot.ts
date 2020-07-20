// import * as tmi from 'tmi.js';
import Service from './Services';

export interface BotConfig {
  channel: string;
  banList: string[];
  // credentials: {
  //   username: string;
  //   password: string;
  // }
  silent: boolean;
  connectedMessage?: string;
}

export interface ChatClient {
  on: (event: 'message' | 'connected', callback: () => void) => void;
  connect: () => void;
  say: (channel: string, message: string) => void;
}

export default class Bot {
  constructor(
    config: BotConfig,
    client: ChatClient,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    context: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    services: Service[] = []
  ) {
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

  config: BotConfig;
  // context is an escape hatch for the service to access its parent driver app, needs to be any
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  context: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  chatClient: ChatClient;
  services: Service[];

  onConnected(/* addr: string, port: number */): void {
    if (!this.config.silent && this.config.connectedMessage) this.sendChatMessage(this.config.connectedMessage);
    this.services.forEach((service) => {
      service.onConnected();
    });
  }

  onMessage(channel: string, userstate: UserState, msg: string, self: boolean): void {
    if (this.config.banList.includes(userstate["display-name"])) return;
    // TODO logging;
    // console.log('onMessage', channel, userstate["display-name"], msg);
    this.services.forEach((service) => {
      service.onMessage(channel, userstate, msg, self);
    });
  }

  sendChatMessage(message: string): void {
    if (!this.config.silent) this.chatClient.say(this.config.channel, message);
  }
}
