# FDC3 Compliance

### Publisher

FDC3 compliant contract

```typescript
const broker = messagebroker<FDC3StandardIntents>();
broker.create('ViewChart').publish({
    type: 'fdc3.instrument',
    name: 'IBM',
    id: {
        ticker: 'ibm',
    },
});
```

### Subscriber

```typescript
const broker = messagebroker<FDC3StandardIntents>();
broker.get('ViewChart').subscribe((message) => {
    displayChart(message.data.id.ticker);
});
```

### Getting a response

```typescript
const broker = messagebroker<FDC3StandardIntents>();
const chatRoomResponses = broker.rsvp('StartChat', {
    type: 'fdc3.contact',
    name: 'Jane Doe',
    id: {
        email: 'jane@mail.com',
    },
});
```
