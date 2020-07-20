import test from 'ava';
import Bot, { ChatClient } from '../src/Bot';

class TestChatClient implements ChatClient {
    chatLog: string[];

    constructor(chatLog: string[]) {
        this.chatLog = chatLog;
    }

    _onMessage: (a:string) => void;
    onMessage(message: string) {
        if (this._onMessage && typeof this._onMessage === 'function') {
            this._onMessage(message);
        }
    }

    _onConnect: () => void;
    onConnect() {
        if (this._onConnect && typeof this._onConnect === 'function') {
            this._onConnect();
        }
    }

    connect() {
        this.onConnect();
    }

    on(event: 'message' | 'connected', callback: () => any) {
        if (event === 'message') {
            this._onMessage = callback;
        }
        else if (event === 'connected') {
            this._onConnect = callback;
        }
    }

    say(channel: string, message: string) {
        this.chatLog.push(`Test: ch<${channel}> : ${message}`)
    }
}

let chatLog: string[] = [];
let chatClient = new TestChatClient(chatLog);

let bot = new Bot(
    {
        banList: [],
        channel: 'test-runner',
        silent: false,
        connectedMessage: 'the test-runner bot has arrived in chat'
    },
    chatClient,
    {},
    []
);

chatClient.connect();

test('connectedMessage displays', t => {
	t.true(
        chatLog.length === 1 && chatLog.includes('the test-runner bot has arrived in chat')
    )
});