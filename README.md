# Example Message Broker Project

This is a simple example project to showcase how to use the
[MessageBroker OSS](https://github.com/morganstanley/message-broker) project.

You can find some examples of MessageBroker usage throughout the app inside blocks of comments like this:

```typescript
/////////////
const broker = messagebroker();
broker.create('channel').publish(message);
etc...
/////////////
```

## Running the app

This is a Deno app, please go to the deno documentation for more info on how Deno works. It uses Vite as the build tool.

These are the commands available:

```
"dev": "vite",
"build": "tsc -b && vite build",
"lint": "eslint .",
"preview": "vite preview"
```

use `deno run dev` to start the project locally.
