Failure in inter-shard back transfer payments, i.e. when callee SC (shard X) sends back payments to its caller SC (shard Y). **Callee is not refunded if back transfer payments failed to be sent to the caller**.

Scenario | Transaction status | Comments
--|--|--
SC A (shard 0, non-payable) calls SC B (shard 0) with async v1. SC B sends back 1 EGLD and 1 ESDT | Transaction success | EGLD sent and received, ESDT sent and received
SC A (shard 0, non-payable) calls SC B (shard 0) with async v2. SC B sends back 1 EGLD and 1 ESDT | Transaction success | EGLD sent and received, ESDT sent and received
SC A (shard 0, non-payable) calls SC B (shard 1) with async v1. SC B sends back 1 EGLD and 1 ESDT | Transaction failure: "sending value to non payable contract" | EGLD sent but not received, ESDT sent and received
SC A (shard 0, non-payable) calls SC B (shard 1) with async v2. SC B sends back 1 EGLD and 1 ESDT | Transaction success | EGLD sent but not received, ESDT sent but not received and an uncompleted async v2 storage remains

# How to reproduce

```bash
npm install

npm run build

npm run test
```