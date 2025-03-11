# Scopes

- A hierarchy of messagebrokers
- Useful for larger applications needing some isolation of messages

## Example

```typescript
const parentBroker: IMessageBroker<IContract> = messagebroker<IContract>();
const childBroker: IMessageBroker<IExtendedContract> = parentBroker.createScope<IExtendedContract>();

parentBroker.get('myChannel').subscribe((message) => console.log('Parent has received!'));
childBroker.get('myChannel').subscribe((message) => console.log('Child has received!'));
```

### Option 1

```typescript
parentBroker.create('myChannel').publish({});
// log: 'Parent has received!' + 'Child has received!'
```

### Option 2

```typescript
childBroker.create('myChannel').publish({});
// log: 'Child has received!'
```
