When a callee SC sends back payments to its caller, a non-payable SC in a different shard, then only the last payment will be successfully sent. Moreover, if the callee sends back more than 1 payment, then the transaction will fail with the error: "sending value to non payable contract". Note that this occurs whether the transaction is async v1 or v2.

# How to reproduce

```bash
npm install

npm run build

npm run test
```