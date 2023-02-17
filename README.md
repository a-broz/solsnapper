# Solana Token Snapshot Tool
Tool for snapshotting tokens + token metadata accounts
- On-chain Metadata Snapshot
- On-chain Metadata Updates

## Commands
#### Convert Key
This command converts a private key from B58 to Uint8Array. Who cares? When you export your wallet from Phantom, or other wallets, it will likely look something like this: 

`kNykCXNxgePDjFbDWjPNvXQRa8U12Ywc19dFVaQ7tebUj3m7H4sF4KKdJwM7yxxb3rqxchdjezX9Szh8bLcQAjb`

In order to use this for solana command line, you will need to convert it to a Uint8Array json file. This command will handle this for you and spit out `key.json`

<i><b>Example Command</b></i>
    
    ```node solsnapper.js convert```

#### Update
```node solsnapper.js update --rpc https://rpc.host.goes.here/ --name <Nft Name> --mint <Mint Address>```
