If an SC A calls an SC B in another shard and SC B sends back tokens to SC A, then:
- it succeeds when SC B sends back only 1 token (e.g. EGLD, fungible token, ...),
- it fails when SC B sends back 2 tokens or more. The error: "sending value to non payable contract".

# How to reproduce

```bash
npm install

npm run build

npm run test
```

# Tests (success / failure)

```
✓ SC A calls SC B, different shards, async v1. SC B sends back EGLD
✓ SC A calls SC B, different shards, async v1. SC B sends back FFT
✓ SC A calls SC B, different shards, async v1. SC B sends back SFT
× SC A calls SC B, different shards, async v1. SC B sends back EGLD+FFT
× SC A calls SC B, different shards, async v1. SC B sends back EGLD+SFT
× SC A calls SC B, different shards, async v1. SC B sends back FFT+EGLD
× SC A calls SC B, different shards, async v1. SC B sends back FFT+SFT
× SC A calls SC B, different shards, async v1. SC B sends back SFT+EGLD
× SC A calls SC B, different shards, async v1. SC B sends back SFT+FFT
✓ SC A calls SC B, different shards, async v2. SC B sends back EGLD
✓ SC A calls SC B, different shards, async v2. SC B sends back FFT
✓ SC A calls SC B, different shards, async v2. SC B sends back SFT
× SC A calls SC B, different shards, async v2. SC B sends back EGLD+FFT
× SC A calls SC B, different shards, async v2. SC B sends back EGLD+SFT
× SC A calls SC B, different shards, async v2. SC B sends back FFT+EGLD
× SC A calls SC B, different shards, async v2. SC B sends back FFT+SFT
× SC A calls SC B, different shards, async v2. SC B sends back SFT+EGLD
× SC A calls SC B, different shards, async v2. SC B sends back SFT+FFT
```
