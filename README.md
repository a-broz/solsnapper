# Solana Token Snapshot Tool

Tool for snapshotting tokens + token metadata accounts
- On-chain Metadata Snapshot
- On-chain Metadata Updates

## Quickstart / Example usage

`node solsnapper.js snapshot --rpc <RPC HOST HERE> mints --creator <CREATOR ADDRESS>`

## Snapshot Commands

### Snapshot mints by Creator

`node solsnapper.js snapshot mints --creator <Creator Address>`

Returns a list of mint addresses by first verified creator. Note: For larger collections this can take up to 10 minutes. If it fails, run it again.

### Snapshot mints by Owner

`node solsnapper.js snapshot mints --owner <Owner Wallet>`

Returns a list of mint addresses by owner wallet.

### Snapshot images by mint list

`node solsnapper.js --rpc <RPC> snapshot images -l <mint list file>`

Downloads a snapshot of image files from a list of NFTS.

### Snapshot metdata by mint list

`node solsnapper.js --rpc <RPC> snapshot metadata -l <mint list file>`

Downloads off chain metadata json structures from a list of NFTs.

## Metadata Update Commands

To process any of the below commands, you must first ensure that you have update authority over the NFT(s) that you are trying to udpate. To setup your key, follow the steps below:

1. Rename `.env.example` to `.env`.
2. Add your private key to the .env file, e.g.:
```
PRIV_KEY=kNykCXNxgePDjFbDWjPNvXQRa8U12Ywc19dFVaQ7tebUj3m7H4sF4KKdJwM7yxxb3rqxchdjezX9Szh8bLcQAjb
```
3. Run `node solsnapper.js convert` 
<b>NOTE:</b> This command converts a private key from B58 to Uint8Array which is what `solana` commandline uses by default. It will spit out a `key.json` file.

#### Update Nft Name single NFT
`node solsnapper.js update --rpc https://rpc.host.goes.here/ --name <Nft Name> --mint <Mint Address>`

#### Update Nft collection against list
This will update a list of mint addresses onto a new metaplex collection.

`--collection` should be set as the correct collection NFT address

`node solsnapper.js --rpc <RPC> update --list mintsByCreator.json --collection 4chqK6Lau6EUytPEoVvUS2qFWvCRM4tqftv79FFn7hEj`

#### Update Nft offchain metadata uri against list
This will update a list of mint addresses onto a new metaplex collection.

`--uri` should be set as the new uri

`node solsnapper.js --rpc <RPC> update --list mintsByCreator.json --uri https://arweave.net/NEWARWEAVELINKHERE`

#### Mass Change Update Authority against list
This will update a list of mint addresses to a new update authority

`--authority` should be set as the new update authority

`node solsnapper.js --rpc <RPC> update --list mintsByCreator.json --authority <NEWAUTHADDRESS>