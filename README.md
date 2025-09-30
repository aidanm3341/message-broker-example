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

## Project Structure

This is a monorepo with two packages:
- `client/` - React/Vite frontend application
- `server/` - Deno WebSocket server

## Running the app

First, install dependencies:
```bash
npm install
```

### Running the client
```bash
npm run dev:client
```

### Running the server
```bash
npm run dev:server
```

### Building
```bash
# Build both client and server
npm run build

# Or build individually
npm run build:client
npm run build:server
```

### Linting
```bash
npm run lint
```
