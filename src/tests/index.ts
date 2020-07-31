import test from 'ava';
import Bot, { ChatClient } from '../Bot';
import Service from '../Services';

class TestChatClient implements ChatClient {
  chatLog: string[];

  constructor(chatLog: string[]) {
    this.chatLog = chatLog;
  }

  mods: any;
  vips: any;

  _onMessage: (channel: string, userstate: UserState, msg: string, self: boolean) => void;
  onMessage(channel: string, userstate: UserState, msg: string, self: boolean) {
    if (this._onMessage && typeof this._onMessage === 'function') {
      this._onMessage(channel, userstate, msg, self);
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

  on(event: 'message' | 'connected', callback: () => void) {
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

test('connectedMessage displays', t => {
  const chatLog: string[] = [];
  const chatClient = new TestChatClient(chatLog);
  new Bot(
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
  t.is(chatLog.length, 1, 'chatlog has single entry');
  t.is(chatLog[0], 'Test: ch<test-runner> : the test-runner bot has arrived in chat');
});

test('no default connectedMessage', t => {
  const chatLog: string[] = [];
  const chatClient = new TestChatClient(chatLog);
  new Bot(
    {
      banList: [],
      channel: 'test-runner',
      silent: false
    },
    chatClient,
    {},
    []
  );
  t.is(chatLog.length, 0, 'chatlog is empty');
});

test('it handles messages properly', t => {
  const chatLog: string[] = [];
  const chatClient = new TestChatClient(chatLog);
  const service: Service = {
    bot: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onConnected() {},
    onMessage(channel: string, userstate: UserState, msg: string/*, self: boolean */) {
      chatLog.push(`Test: ch<${channel}> : ${msg}`);
    },
    onMonetization(){}
  };
  new Bot(
    {
      banList: [],
      channel: 'test-runner',
      silent: false
    },
    chatClient,
    {},
    [
      service,
      service,
      service
    ]
  );

  chatClient.onMessage('test-runner', { "display-name": 'test-bot' }, 'Welcome friends, I\'m your friendly neighborhood bot', true);

  console.log('chatLog---', chatLog);
  t.is(chatLog.length, 3, 'chatlog has single entry');
  t.is(chatLog[0], 'Test: ch<test-runner> : Welcome friends, I\'m your friendly neighborhood bot');
  t.is(chatLog[1], 'Test: ch<test-runner> : Welcome friends, I\'m your friendly neighborhood bot');
  t.is(chatLog[2], 'Test: ch<test-runner> : Welcome friends, I\'m your friendly neighborhood bot');
});
