# MyHealth

MyHealth is a decentralized healthcare platform built on the Intenet Computer.

## Requirements

- [IC SDK](https://internetcomputer.org/docs/current/developer-docs/setup/quickstart)
- [Node.js](https://nodejs.org/en/)
- [jq](https://jqlang.github.io/jq/)

## Installation

Clone this repository:

```bash
git clone https://github.com/akmalhisyammm/myhealth.git
cd myhealth
```

`jq` is a command-line JSON processor you will use to run scripts in this project. If you don't already have it installed:

```bash
sudo apt update && sudo apt install -y jq
```

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

```bash
npm run install:dfx
```

Next you will want to start a replica, which is a local instance of the IC that you can deploy your canisters to:

```bash
npm run start:replica
```

Install project dependencies:

```bash
npm install
```

Now you can deploy your canister locally:

```bash
npm run deploy:local
```

Assuming you have [created a cycles wallet](https://internetcomputer.org/docs/current/developer-docs/quickstart/network-quickstart) and funded it with cycles, you can deploy to mainnet like this:

```bash
npm run deploy:mainnet
```

If you ever want to stop the replica:

```bash
npm run stop:replica
```

## License

This smart contract is licensed under MIT License. Please see the [LICENSE](./LICENSE) for more information.
