# Bot-Framework

A node.js library for making your own chat bots. The Bot class orchestrates the message handlers and sending messages across passed in Services.

## Setup
Import the Bot to your app and configure it with Services and your chat client (tmi.js currently)

```ts
new Bot(
  {
    banList: [],
    channel: ENV.credentials.channel,
    silent: false,
    connectedMessage: 'Example Bot reporting for duty'
  },
  new tmi.client({ ... }),
  {
    myAppContext: applicationInstance
  },
  [
    new WelcomeService()
  ]
);
```

### Services

A service can do anything from welcoming users, reminding you to drink water, or controlling a game. Extend this class to add functionality to your bot

```ts
class WelcomeService extends Service {
  onMessage(channel: string, userstate: UserState, msg: string, self: boolean) {
    if (!self) {
      if (msg.startsWith('!welcome')) {
        this.bot.sendChatMessage(`Welcome to the stream ${userstate['display-name']}`);
      }
    }
  }
}
```
