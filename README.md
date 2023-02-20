# Solana Token Snapshot Tool

Tool for snapshotting tokens + token metadata accounts
- On-chain Metadata Snapshot
- On-chain Metadata Updates

## Quickstart / Example usage

`node solsnapper.js snapshot --rpc <RPC HOST HERE> mints --creator <CREATOR ADDRESS>`

## Snapshot Commands

### Snapshot by Creator

`node solsnapper.js snapshot mints --creator <Creator Address>`

Returns a list of mint addresses by creator. Note: For larger collections this can take up to 10 minutes. If it fails, run it again.

#### Snapshot by Owner

`node solsnapper.js snapshot mints --owner <Owner Wallet>`

Returns a list of mint addresses by owner wallet.

## Metadata Update Commands

To process any of the below commands, you must first ensure that you have update authority over the NFT(s) that you are trying to udpate. To setup your key, follow the steps below:

1. Rename `.env.example` to `.env`.
2. Add your private key to the .env file, e.g.:
```
PRIV_KEY=kNykCXNxgePDjFbDWjPNvXQRa8U12Ywc19dFVaQ7tebUj3m7H4sF4KKdJwM7yxxb3rqxchdjezX9Szh8bLcQAjb
```
3. Run `node solsnapper.js convert` 
<b>NOTE:</b> This command converts a private key from B58 to Uint8Array which is what `solana` commandline uses by default. It will spit out a `key.json` file.

#### Update Nft Name
`node solsnapper.js update --rpc https://rpc.host.goes.here/ --name <Nft Name> --mint <Mint Address>`
