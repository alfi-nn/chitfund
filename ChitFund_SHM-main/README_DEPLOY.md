# Deploy (Hardhat + Shardeum)

## Prerequisites
- Node 18+
- `npm i -D hardhat @nomicfoundation/hardhat-toolbox dotenv`
- Funded private key on Shardeum

## .env
```
RPC_URL=https://your-shardeum-rpc
PRIVATE_KEY=0xyourprivatekey
CHAIN_ID=8082
# optional for scripts
FACTORY_ADDR=0x...
REPUTATION_ADDR=0x...
FEE_TREASURY=0x...
MIN_MEMBERS=5
MAX_MEMBERS=50
MIN_CONTRIB=1
MAX_FEE_BPS=1000
# group creation defaults
CURRENCY_ADDR=0x0000000000000000000000000000000000000000
CONTRIB=1000000000000000000
MEMBERS_MAX=20
DURATION=20
START_TIME=
FEE_BPS=500
SEC_DEPOSIT=0
COMMIT_SEC=1800
REVEAL_SEC=1800
PERIOD_SEC=2592000
```

## Compile
```
npx hardhat compile
```

## Deploy core (Reputation, Factory)
```
npx hardhat run scripts/00_deploy_core.js --network shardeum
```
Copy the printed addresses into `.env` as `FACTORY_ADDR` and `REPUTATION_ADDR`.

## Update settings (optional)
```
npx hardhat run scripts/02_update_settings.js --network shardeum
```

## Create a group
```
npx hardhat run scripts/01_create_group.js --network shardeum
```

## Wire frontend
- Set `src/web3/config.js` `NETWORK.rpcUrl`, `NETWORK.chainId`, and `ADDRESSES.ChitFundFactory`.
- If you use reputation in UI, set `ADDRESSES.ReputationSystem`.

## Notes
- `ChitFundFactory.createChitGroup` now deploys a real `ChitGroup` and tracks it.
- Bidding uses commit-reveal per cycle. Ensure commit/reveal windows align with your UI timers.
- For ERC20 groups, users must `approve` token spending to the group or PaymentManager if added; current flow uses native or transferFrom in group join for deposit. 