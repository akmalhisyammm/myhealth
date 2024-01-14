# MyHealth

MyHealth is a decentralized healthcare platform built on the Intenet Computer. With decentralized data storage, user data will be securely stored on the blockchain. We are open to any hospitals that wants to connect their systems with MyHealth.

## Motivation

We realized that there are security issues with centralized data storage in the medical field, which is still adopted by most hospitals today. With centralized data storage, all patient data is stored centrally on a hospital's server, so patients have no control over their data. Therefore, MyHealth was created to overcome these problems by converting centralized data storage into decentralized data storage. With decentralized data storage, patients have full control over who can access their personal data and medical records. In addition, patients can also visit various hospitals using existing data, so that patients can feel safer and easier when visiting various hospitals.

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

Start the project in development mode:

```bash
npm run dev
```

Assuming you have [created a cycles wallet](https://internetcomputer.org/docs/current/developer-docs/quickstart/network-quickstart) and funded it with cycles, you can deploy to mainnet like this:

```bash
npm run deploy:mainnet
```

If you ever want to stop the replica:

```bash
npm run stop:replica
```

## Structures

```
.
├── public/             # Static files
├── scripts/            # Script helpers
├── src/
│   ├── app/            # Next.js app router (Frontend)
│   ├── contract/       # Azle canister (Backend)
│   ├── declarations/   # Frontend and Backend connector
│   └── lib/            # Project libraries
├── LICENSE
├── README.md
├── dfx.json            # DFX configurations
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── tsconfig.json
```

## Features

### Owner (Terminal Only)

- Able to add a new hospital.

- Able to verify all users.

To initialize you as the owner, you need to run the following command:

```bash
dfx canister call myhealth_backend initCallerAsOwner
```

To verify user, the owner needs to get a list of unverified users by running the following command:

```bash
dfx canister call myhealth_backend getUnverifiedUsers
```

Copy the user ID that the owner wants to review, then run the following command to verify:

```bash
dfx canister call myhealth_backend reviewUser '(<USER_ID>, true)'
```

If the owner wants to reject the user, the owner can change the second parameter to `false`:

```bash
dfx canister call myhealth_backend reviewUser '(<USER_ID>, false)'
```

Example:

```bash
dfx canister call myhealth_backend reviewUser '(principal "kxauy-kjdop-wjmxk-i2mvu-x5d5o-oljmp-mawxf-lax7h-bhfzx-5zzao-gae", true)'
```

### Admin

- Able to verify all patient, doctor and nurse in the same hospital.

### Doctor

- Able to change his/her practice schedule.
- Able to confirm or reject appointments made by patients.
- Able to view all medical records of patients who have scheduled appointments.
- Able to review the patient's medical record after the scheduled appointments.

### Nurse

- Able to review all medical records of patients after the scheduled appointments with doctors at the same hospital.

### Patient

- Able to create and delete appointments with doctors (if not confirmed yet).
- Able to view all of his/her medical records.

## Authors

- [Muhammad Syiarul Amrullah](https://github.com/muhammadarl)
- [Muhammad Akmal Hisyam](https://github.com/akmalhisyammm)
- [Rilo Anggoro Saputra](https://github.com/riloanggoro)
- [Irwan Prasetyo](https://github.com/vroken)
- [Dzul Jalali Wal Ikram](https://github.com/DzulJalali)

## Credits

- [Freepik](https://www.freepik.com/)

## License

This project is licensed under MIT License. Please see the [LICENSE](./LICENSE) for more information.
