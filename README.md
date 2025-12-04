# Simple EVM Hackathon Project (Sepolia) — Fixed Version

This repository is the fixed version ready to submit to GitHub.
It includes:
- Solidity contracts: RewardToken (ERC-20) and SimpleBank.
- Hardhat (with @nomicfoundation/hardhat-toolbox), deploy script that writes frontend/.env.local.
- Tests (Hardhat).
- Next.js + Tailwind frontend.

## Quick steps to run (local or Sepolia)

1. Install root deps:
   npm install

2. Install frontend deps:
   cd frontend && npm install && cd ..

3. Create .env (root) from .env.example and set:
   ALCHEMY_RPC and PRIVATE_KEY

4. Compile:
   npx hardhat compile

5a. Local deploy:
   npx hardhat node
   npx hardhat run --network localhost scripts/deploy.js

5b. Sepolia deploy:
   npx hardhat run --network sepolia scripts/deploy.js

The deploy script will write frontend/.env.local with NEXT_PUBLIC_BANK_ADDRESS and NEXT_PUBLIC_REWARD_ADDRESS.

6. Run frontend:
   cd frontend
   npm run dev
   Open http://localhost:3000

## Notes
- Keep your .env private (do not commit keys).
- If you need me to rename the project, or adjust token rate, or add UI features, tell me and I'll update and resend the ZIP.
