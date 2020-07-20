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
    onMessage(message) {
        if (this._onMessage && typeof this._onMessage === 'function') {
            this._onMessage(message);
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
let chatLog = [];
let chatClient = new TestChatClient(chatLog);
let bot = new Bot_1.default({
    banList: [],
    channel: 'test-runner',
    silent: false,
    connectedMessage: 'the test-runner bot has arrived in chat'
}, chatClient, {}, []);
chatClient.connect();
ava_1.default('connectedMessage displays', t => {
    t.true(chatLog.length === 1 && chatLog.includes('the test-runner bot has arrived in chat'));
});
