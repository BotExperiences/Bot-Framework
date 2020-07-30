"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const Bot_1 = __importDefault(require("../src/Bot"));
class TestChatClient {
    constructor(chatLog) {
        this.chatLog = chatLog;
    }
    onMessage(channel, userstate, msg, self) {
        if (this._onMessage && typeof this._onMessage === 'function') {
            this._onMessage(channel, userstate, msg, self);
        }
    }
    onConnect() {
        if (this._onConnect && typeof this._onConnect === 'function') {
            this._onConnect();
        }
    }
    connect() {
        this.onConnect();
    }
    on(event, callback) {
        if (event === 'message') {
            this._onMessage = callback;
        }
        else if (event === 'connected') {
            this._onConnect = callback;
        }
    }
    say(channel, message) {
        this.chatLog.push(`Test: ch<${channel}> : ${message}`);
    }
}
ava_1.default('connectedMessage displays', t => {
    const chatLog = [];
    const chatClient = new TestChatClient(chatLog);
    new Bot_1.default({
        banList: [],
        channel: 'test-runner',
        silent: false,
        connectedMessage: 'the test-runner bot has arrived in chat'
    }, chatClient, {}, []);
    t.is(chatLog.length, 1, 'chatlog has single entry');
    t.is(chatLog[0], 'Test: ch<test-runner> : the test-runner bot has arrived in chat');
});
ava_1.default('no default connectedMessage', t => {
    const chatLog = [];
    const chatClient = new TestChatClient(chatLog);
    new Bot_1.default({
        banList: [],
        channel: 'test-runner',
        silent: false
    }, chatClient, {}, []);
    t.is(chatLog.length, 0, 'chatlog is empty');
});
ava_1.default('it handles messages properly', t => {
    const chatLog = [];
    const chatClient = new TestChatClient(chatLog);
    const service = {
        bot: null,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onConnected() { },
        onMessage(channel, userstate, msg /*, self: boolean */) {
            chatLog.push(`Test: ch<${channel}> : ${msg}`);
        },
        onMonetization() { }
    };
    new Bot_1.default({
        banList: [],
        channel: 'test-runner',
        silent: false
    }, chatClient, {}, [
        service,
        service,
        service
    ]);
    chatClient.onMessage('test-runner', { "display-name": 'test-bot' }, 'Welcome friends, I\'m your friendly neighborhood bot', true);
    console.log('chatLog---', chatLog);
    t.is(chatLog.length, 3, 'chatlog has single entry');
    t.is(chatLog[0], 'Test: ch<test-runner> : Welcome friends, I\'m your friendly neighborhood bot');
    t.is(chatLog[1], 'Test: ch<test-runner> : Welcome friends, I\'m your friendly neighborhood bot');
    t.is(chatLog[2], 'Test: ch<test-runner> : Welcome friends, I\'m your friendly neighborhood bot');
});
