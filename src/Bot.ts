import Service from './Services';

export interface BotConfig {
  channel: string;
  banList: string[];
  silent: boolean;
  connectedMessage?: string;
}

type tmiEvent = 'message'
  | 'connected'
  | 'anongiftpaidupgrade'
  | 'cheer'
  | 'giftpaidupgrade'
  | 'resub'
  | 'subgift'
  | 'submysterygift'
  | 'subscription'
  | 'join'
  | 'part';

import { CommonUserstate } from 'tmi.js'

export interface ChatClient {
  on: (event: tmiEvent, callback: (...args: any[]) => void) => void;
  connect: () => void;
  say: (channel: string, message: string) => void;
  mods: (channel: string) => Promise<string[]>;
  vips: (channel: string) => Promise<string[]>;
}


export interface UserState extends CommonUserstate { } // eslint-disable-line @typescript-eslint/no-empty-interface

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
    //#region setup chatClient hooks
    this.chatClient.on('message', this.onMessage.bind(this));
    this.chatClient.on('connected', this.onConnected.bind(this));
    this.chatClient.on('join', this.onJoin.bind(this));
    this.chatClient.on('part', this.onPart.bind(this));

    // Monetization
    this.chatClient.on('anongiftpaidupgrade', (channel: string, username: string, userstate: UserState) => {
      this.onMonetization(channel, userstate, '', { type: 'anongiftpaidupgrade' });
    });
    this.chatClient.on('cheer', (channel: string, userstate: UserState, message) => {
      this.onMonetization(channel, userstate, message, { type: 'cheer' });
    });
    this.chatClient.on('giftpaidupgrade', (channel: string, username: string, sender: string, userstate: UserState) => {
      this.onMonetization(channel, userstate, '', { type: 'giftpaidupgrade', sender });
    });
    this.chatClient.on('resub', (channel: string, username: string, months: number, message: string, userstate: UserState, methods: any) => {
      this.onMonetization(channel, userstate, message, { type: 'resub', months, methods });
    });
    this.chatClient.on('subgift', (channel: string, username: string, streakMonths: number, recipient: string, methods: any, userstate: UserState) => {
      this.onMonetization(channel, userstate, '', { type: 'subgift', streakMonths, recipient, methods });
    });
    this.chatClient.on('submysterygift', (channel: string, username: string, numbOfSubs: number, methods: any, userstate: UserState) => {
      this.onMonetization(channel, userstate, '', { type: 'submysterygift', numbOfSubs, methods });
    });
    this.chatClient.on('subscription', (channel, username, method, message, userstate) => {
      this.onMonetization(channel, userstate, message, { type: 'subscription', method })
    });
    //#endregion

    // Connect to chat!
    this.chatClient.connect();
  }

  config: BotConfig;
  // context is an escape hatch for the service to access its parent driver app, needs to be any
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  context: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  chatClient: ChatClient;
  private services: Service[];
  mods: string[] = [];
  vips: string[] = [];

  onConnected(/* addr: string, port: number */): void {
    if (!this.config.silent && this.config.connectedMessage) this.sendChatMessage(this.config.connectedMessage);
    this.services.forEach((service) => {
      service.onConnected();
    });
    // Get mod and VIP lists
    this.chatClient.mods(this.config.channel).then(data => this.mods = data);
    this.chatClient.vips(this.config.channel).then(data => this.vips = data);
  }

  onMessage(channel: string, userstate: UserState, msg: string, self: boolean): void {
    if (this.config.banList.includes(userstate["display-name"])) return;
    // TODO logging;
    // console.log('onMessage', channel, userstate["display-name"], msg);
    this.services.forEach((service) => {
      service.onMessage(channel, userstate, msg, self);
    });
  }

  onMonetization(channel: string, userstate: UserState, msg: string, monetization: any): void {
    this.services.forEach((service) => {
      service.onMonetization(channel, userstate, msg, monetization);
    });
  }

  onJoin(channel: string, username: string, self: boolean): void {
    this.services.forEach((service) => {
      service.onJoin(channel, username, self);
    });
  }

  onPart(channel: string, username: string, self: boolean): void {
    this.services.forEach((service) => {
      service.onPart(channel, username, self);
    });
  }

  sendChatMessage(message: string): void {
    if (!this.config.silent) this.chatClient.say(this.config.channel, message);
  }
}
